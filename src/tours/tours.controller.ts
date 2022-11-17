import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
} from "@nestjs/common";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";
import { CityDto } from "src/location/dto/city.dto";
import { LocationService } from "src/location/locations.service";
import { AuthGuard } from "src/shared/auth.guard";
import { TourDto } from "./dto/tour.dto";
import { TourOutputDto } from "./dto/tourOutput.dto";
import { iTour } from "./interfaces/tours.interface";
import { ToursService } from "./tours.service";

@Controller("tours")
export class ToursController {
    constructor(
        private readonly tourService: ToursService,
        private readonly locationService: LocationService
    ) {}

    @Get("popular/tours")
    async popularTours(): Promise<TourOutputDto[]> {
        const list = await this.tourService.getPopularTours();
        return list.map((x) => new TourOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("popular/cities")
    async getPopularCities(): Promise<CityDto[]> {
        const list = await this.locationService.getPopularCities();
        return list.map((x) => new CityDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("country/:country")
    async countryTours(
        @Param("country") country: string,
        @Query("english") isEnglishName = true
    ): Promise<TourOutputDto[]> {
        const tours = await this.tourService.getCountryTours(
            country,
            !isEnglishName
        );
        return tours.map((x) => new TourOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("city/:city")
    async cityTours(
        @Param("city") city: string,
        @Query("english") isEnglishName = true
    ): Promise<TourOutputDto[]> {
        const tours = await this.tourService.getCityTours(city, !isEnglishName);
        return tours.map((x) => new TourOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("tour/:id")
    async getTour(@Param("id") id: string): Promise<TourOutputDto> {
        return new TourOutputDto(await this.tourService.getTour(id));
    }

    @UseGuards(AuthGuard)
    @Delete("tour/:id")
    async deleteTour(@Param("id") id: string) {
        const tour = await this.tourService.deleteTour(id);
        if (!tour) throw new TourNotFoundException();
        else return true;
    }

    @UseGuards(AuthGuard)
    @Put("tour/:id")
    async updateTour(
        @Param("id") tourId: string,
        @Body() tourDto: TourDto
    ): Promise<TourOutputDto> {
        return new TourOutputDto(
            await this.tourService.updateTour(tourId, tourDto)
        );
    }

    @UseGuards(AuthGuard)
    @Post("tour/create")
    async createNewTour(@Body() tourDto: TourDto) {
        const result = await this.tourService.registerTour(tourDto);
        return new TourOutputDto(result);
    }
}
