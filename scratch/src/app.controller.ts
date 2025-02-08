import { Controller, Get } from "@nestjs/common";

@Controller('/app')
export class AppController {
  @Get()
  getRootToute(): string {
    return "Hello World YO";
  }

  @Get("/bye")
  getByeThere(): string {
    return "Bye there";
  }
}