const Carousel = require('../class/Carousel');
const carouselDAO = require("../models/carouselDAO");
const bannerPriceDAO = require("../models/bannerPriceDAO");
const googleUp = require("./googleUploadCtrl");

class CarouselCtrl {
    new = async (req, res) => {
        try {
            const carouselBody = req.body;

            const emptyKeys = Object.keys(carouselBody).filter(item => !carouselBody[item]);

            if(emptyKeys.length) {
                return this.sendResponse(res, 200, {alert: `Todos os campos devem ser preenchidos.`}); 
            }
            
            const carousel = new Carousel(carouselBody);

            const price = await bannerPriceDAO.findById(carousel.getCarouselType());
            carousel.setPayment(price[0].price);


            carousel.setStatus('pendente');
            
            const carouselIgm = await this.setImg(carousel.getImage(), carousel.getUserId());

            carousel.setImage('https://lh3.google.com/u/0/d/' + carouselIgm);
            const result = await carousel.save();

            const response = {
                type: price[0].description,
                description: carousel.getDescription(),
                payment: carousel.getPayment(),
                payment_type: carousel.getPaymentType(),
                status: carousel.getStatus(),
                id: result[0].insertId
            }

            return this.sendResponse(res, 200, response);
        } catch (error) {
            return this.sendResponse(res, 500, {error: 'Falha ao criar o carousel.'});
        }
    }

    updateCarousel = async (req, res) => {
        try {
            const carouselBody = req.body;

            const carousel = new Carousel(carouselBody);

            const sameImg = await carouselDAO.findImgById(carousel.getImage());

            if(!sameImg) {
                const newImg = await this.setImg(carousel.getImage(), carousel.getUserId());
                carousel.setImage('https://lh3.google.com/u/0/d/' + newImg);
            }

            await carousel.update();

            return this.sendResponse(res, 200, {success: 'Carousel atualizado com sucesso.'});
        } catch (error) {
            return this.sendResponse(res, 500, {error: 'Falha ao atualizar o carousel.'});
        }
    }

    deleteCarousel = async (req, res) => {
        try {
            const { id } = req.params;
            await carouselDAO.deleteDAO(id);

            return this.sendResponse(res, 200, {success: 'Carousel deletado com sucesso.'});
        } catch (error) {
            return this.sendResponse(res, 500, {error: 'Falha ao deletar o carousel'});
        }
    }

    listCarousels = async (req, res) => {
        try {
            const { status } = req.query;
            const carousel = await carouselDAO.findAllByStatus(status);

            return this.sendResponse(res, 200, carousel);
        } catch (error) {
            return this.sendResponse(res, 500, {error: 'Falha ao buscar os carousels'});
        }
    }

    setImg = async (file, nameFile) => {
        const img64 = file.replace(/^data:image\/jpeg;base64,/, '');
        const decodedImage = Buffer.from(img64, 'base64');

        const carouselImg = await googleUp.uploadFile(nameFile +'_carousel.jpg', 'jpg', decodedImage);
        return carouselImg;
    }

    sendResponse = (res, statusCode, msg) => {
        res.status(statusCode).json(msg);
    }
}

module.exports = new CarouselCtrl;