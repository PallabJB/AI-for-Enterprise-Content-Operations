from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import datetime
import asyncio

# Agent Imports (Relative path issue fix if running main.py directly)
from agents.creator_agent import CreatorAgent
from agents.compliance_agent import ComplianceAgent
from agents.localization_agent import LocalizationAgent

app = FastAPI(title="Enterprise AI Content Ops")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineStep(BaseModel):
    step_id: str
    agent_name: str
    status: str # pending, running, completed, manual_review, failed
    output: Optional[Any] = None
    input_data: Optional[Dict] = None
    updated_at: str

class ContentPipeline(BaseModel):
    id: str
    title: str
    source_document: str
    target_channels: List[str]
    target_locales: List[str]
    steps: List[PipelineStep]
    status: str # processing, completed, approved, rejected
    created_at: str
    current_draft: Optional[Dict] = None
    compliance_report: Optional[Dict] = None
    localization_report: Optional[Dict] = None

# Global store
content_pipelines: Dict[str, ContentPipeline] = {}

# Agents Initialization
creator = CreatorAgent()
compliance = ComplianceAgent()
localizer = LocalizationAgent()

async def run_pipeline(pipeline_id: str):
    if pipeline_id not in content_pipelines:
        return
    
    pipeline = content_pipelines[pipeline_id]
    
    # 1. Drafting Phase
    try:
        step = next(s for s in pipeline.steps if s.step_id == "creation")
        step.status = "running"
        step.updated_at = str(datetime.datetime.now())
        
        drafts_data = await creator.execute(pipeline.source_document, pipeline.target_channels)
        pipeline.current_draft = drafts_data["drafts"]
        
        step.status = "completed"
        step.output = drafts_data
        step.updated_at = str(datetime.datetime.now())
    except Exception as e:
        step.status = "failed"
        step.output = {"error": str(e)}
        return

    # 2. Compliance Phase
    try:
        step = next(s for s in pipeline.steps if s.step_id == "compliance")
        step.status = "running"
        step.updated_at = str(datetime.datetime.now())
        
        comp_report = await compliance.execute(pipeline.current_draft)
        pipeline.compliance_report = comp_report
        
        step.status = "completed"
        step.output = comp_report
        step.updated_at = str(datetime.datetime.now())
    except Exception as e:
        step.status = "failed"
        return

    # 3. Localization Phase
    try:
        step = next(s for s in pipeline.steps if s.step_id == "localization")
        step.status = "running"
        step.updated_at = str(datetime.datetime.now())
        
        loc_report = await localizer.execute(pipeline.current_draft, pipeline.target_locales)
        pipeline.localization_report = loc_report
        
        step.status = "completed"
        step.output = loc_report
        step.updated_at = str(datetime.datetime.now())
    except Exception as e:
        step.status = "failed"
        return

    # 4. Human Approval Gate
    step = next(s for s in pipeline.steps if s.step_id == "approval")
    step.status = "manual_review"
    step.updated_at = str(datetime.datetime.now())
    
    pipeline.status = "completed"

class PipelineRequest(BaseModel):
    title: str
    source_content: str
    channels: List[str]
    locales: List[str]

@app.get("/")
def read_root():
    return {"status": "Enterprise AI Content Ops API Online"}

@app.post("/pipelines", response_model=ContentPipeline)
async def create_pipeline(request: PipelineRequest, background_tasks: BackgroundTasks):
    pipeline_id = str(uuid.uuid4())
    now = str(datetime.datetime.now())
    
    steps = [
        PipelineStep(
            step_id="creation", 
            agent_name="Creator Agent", 
            status="pending", 
            updated_at=now
        ),
        PipelineStep(
            step_id="compliance", 
            agent_name="Compliance Agent", 
            status="pending", 
            updated_at=now
        ),
        PipelineStep(
            step_id="localization", 
            agent_name="Localization Agent", 
            status="pending", 
            updated_at=now
        ),
        PipelineStep(
            step_id="approval", 
            agent_name="Review & Governance", 
            status="pending", 
            updated_at=now
        )
    ]
    
    pipeline = ContentPipeline(
        id=pipeline_id,
        title=request.title,
        source_document=request.source_content,
        target_channels=request.channels,
        target_locales=request.locales,
        steps=steps,
        status="processing",
        created_at=now
    )
    
    content_pipelines[pipeline_id] = pipeline
    
    # Trigger orchestration
    background_tasks.add_task(run_pipeline, pipeline_id)
    
    return pipeline

@app.get("/pipelines")
async def list_pipelines():
    return list(content_pipelines.values())

@app.get("/pipelines/{pipeline_id}")
async def get_pipeline(pipeline_id: str):
    if pipeline_id not in content_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return content_pipelines[pipeline_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
