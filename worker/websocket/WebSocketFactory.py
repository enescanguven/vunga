class WebSocketFactory(WebSocketServerFactory):
    def __init__(self, input_type):
        self.input_type = input_type

    def create_input(self, strategy_config):
        if self.input_type == "elasticsearch":
            return ElasticsearchInputStrategy(strategy_config)
        elif self.input_type == "filesystem-slow":
            return SibergozFileSystemInputStrategy(strategy_config)
        elif self.input_type == "filesystem":
            return SibergozFileSystemFasterInputStrategy(strategy_config)
        else:
            raise Exception("Invalid input type")
