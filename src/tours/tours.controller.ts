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
    HttpStatus,
} from "@nestjs/common";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";
import { TourDto } from "./dto/tour.dto";
import { TourOutputDto } from "./dto/tourOutput.dto";
import { iTour } from "./interfaces/tours.interface";
import { ToursService } from "./tours.service";

@Controller("tours")
export class ToursController {
    constructor(private readonly tourService: ToursService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":country")
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
    @Get(":city")
    async cityTours(
        @Param("city") city: string,
        @Query("english") isEnglishName = true
    ): Promise<TourOutputDto[]> {
        const tours = await this.tourService.getCityTours(city, !isEnglishName);
        return tours.map((x) => new TourOutputDto(x));
    }

    @Delete(":id")
    async deleteTour(@Param("id") id: string) {
        const tour = await this.tourService.deleteTour(id);
        if (!tour) throw new TourNotFoundException();
        else return true;
    }

    @Put(":id")
    async updateTour(@Param("id") tourId: string) {
        return true;
    }

    @Post("new")
    async createNewTour(@Body() tourDto: TourDto) {
        const result = await this.tourService.registerTour(tourDto);
        return new TourOutputDto(result);
    }
}
