import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";
import { CityDto } from "./dto/city.dto";
import { CityOutputDto } from "./dto/cityOutput.dto";
import { CountryDto } from "./dto/country.dto";
import { CountryOutputDto } from "./dto/countryOutput.dto";
import { LocationService } from "./locations.service";

@Controller("location")
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("city")
    async getAllCity(): Promise<CityOutputDto[]> {
        const list = await this.locationService.getAllCity();
        return list.map((x) => new CityOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("country")
    async getAllCountry(): Promise<CountryOutputDto[]> {
        const list = await this.locationService.getAllCountry();
        return list.map((x) => new CountryOutputDto(x));
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post("city/create")
    async createCity(@Body() cityDto: CityDto): Promise<CityOutputDto> {
        return new CityOutputDto(
            await this.locationService.registerCity(cityDto)
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post("country/create")
    async createCountry(
        @Body() countryDto: CountryDto
    ): Promise<CountryOutputDto> {
        return new CountryOutputDto(
            await this.locationService.registerCountry(countryDto)
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Put("country/:id")
    async updateCountry(
        @Param("id") id: string,
        @Body() countryDto: CountryDto
    ): Promise<CountryOutputDto> {
        return new CountryOutputDto(
            await this.locationService.updateCountry(id, countryDto)
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Put("city/:id")
    async updateCity(
        @Param("id") id: string,
        @Body() cityDto: CityDto
    ): Promise<CityOutputDto> {
        return new CityOutputDto(
            await this.locationService.updateCity(id, cityDto)
        );
    }

    @UseGuards(AuthGuard)
    @Delete("city/:id")
    async deleteCity(@Param("id") id: string) {
        const result = await this.locationService.deleteCity(id);
        return !!result;
    }

    @UseGuards(AuthGuard)
    @Delete("country/:id")
    async deleteCountry(@Param("id") id: string) {
        const result = await this.locationService.deleteCountry(id);
        return !!result;
    }
}
