import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    UseInterceptors,
} from "@nestjs/common";
import { CityDto } from "./dto/city.dto";
import { LocationService } from "./locations.service";

@Controller("location")
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("populars")
    async getPopularCities(): Promise<CityDto[]> {
        const list = await this.locationService.getPopularCities();
        return list.map((x) => new CityDto(x));
    }
}
