import { ApiResponseService } from "src/common/helpers/api-response.helper";
import { CountriesService } from "./countries.service";
import { Controller, Get } from "@nestjs/common";

@Controller()
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('get-countries')
  async findAll() {
    const data = await this.countriesService.findAll();
    return this.apiResponse.success('Éxito', data);
  }
}
