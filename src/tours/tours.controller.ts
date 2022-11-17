import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Query,
} from "@nestjs/common";
import { BuyTourDto } from "./dto/buyTour.dto";
import { RegisteTourDto } from "./dto/tour.dto";
import { UpdateTourDto } from "./dto/updateTour.dto";
import { ToursService } from "./tours.service";

@Controller("tours")
export class ToursController {
    constructor(private readonly tourService: ToursService) {}

    @Get("list")
    async getAllTours(@Query("order") inOrder: boolean) {
        return await this.tourService.getAll(inOrder);
    }

    @Get(":country")
    async test(
        @Param("country") country: string,
        @Query("english") isEnglishName = true
    ) {
        return await this.tourService.getCountryTours(country, isEnglishName);
    }

    @Post("register")
    async registerTour(@Body() tourDto: RegisteTourDto) {
        return await this.tourService.registerTour(tourDto);
    }

    @Patch(":id")
    async updateTour(
        @Param("id") tourId: string,
        @Body() updateTourDto: UpdateTourDto
    ) {
        return await this.tourService.updateTour(tourId, updateTourDto);
    }

    @Delete(":id")
    async deleteTour(@Param("id") tourId: string) {
        return await this.tourService.deleteTour(tourId);
    }

    @Post("buy")
    async buyTour(@Body() buyDto: BuyTourDto) {
        return await this.tourService.buyTour(buyDto);
    }
}
