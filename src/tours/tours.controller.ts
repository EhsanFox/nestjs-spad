import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpStatus,
} from "@nestjs/common";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";
import { TourDto } from "./dto/tour.dto";
import { iTour } from "./interfaces/tours.interface";
import { ToursService } from "./tours.service";

@Controller("tours")
export class ToursController {
    constructor(private readonly tourService: ToursService) {}

    @Get(":country")
    async test(
        @Param("country") country: string,
        @Query("english") isEnglishName = true
    ) {
        return await this.tourService.getCountryTours(country, !isEnglishName);
    }

    @Delete(":title")
    async deleteTour(@Param("title") title: string) {
        const tour = await this.tourService.deleteTour(title);
        if (!tour) throw new TourNotFoundException();
        else return { message: "ok", statusCode: HttpStatus.OK };
    }

    @Post("new")
    async createNewTour(@Body() tourDto: TourDto) {}
}
