class BaseAgent:
    def __init__(self, name: str):
        self.name = name

    async def execute(self, input_data: any) -> any:
        raise NotImplementedError("Each agent must implement its own execute method")
