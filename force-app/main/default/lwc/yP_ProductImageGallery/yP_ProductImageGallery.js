import { LightningElement, api } from 'lwc';
import PhotoPreview from 'c/yP_PhotoPreview';

export default class YP_ProductImageGallery extends LightningElement {
    slides = []
    slideIndex = 1;
    @api
    get images(){
        return this.slides;
    }

    set images(data){
        this.slides = data.map((item, index) => {
            return index === 0 ? {
                ...item,
                slideIndex: index + 1,
                cardClasses: 'slds-show',
                dotClasses: 'dot active'
            }:{
                ...item,
                slideIndex: index + 1,
                cardClasses: 'slds-hide',
                dotClasses: 'dot'
            }
        })

    }

    prevSlide(){
        let index = this.slideIndex - 1;
        if(index < 1){
            this.slideIndex = this.slides.length;
        }
        else{
            this.slideIndex = index;
        }
        this.changeSlide();
    }

    nextSlide(){
        let index = this.slideIndex + 1;
        if(index > this.slides.length){
            this.slideIndex = 1;
        }
        else{
            this.slideIndex = index;
        }
        this.changeSlide();
        
    }

    changeSlide(){
        this.slides = this.slides.map(item => {
            return this.slideIndex === item.slideIndex ? {
                ...item,
                cardClasses: 'slds-show',
                dotClasses: 'dot active'
            }:{
                ...item,
                cardClasses: 'slds-hide',
                dotClasses: 'dot'
            }
        })
    }

    currentSlide(event){
        this.slideIndex = Number(event.target.dataset.id);
        this.changeSlide();
    }

    async openPreview(event){
        let index = Number(event.target.dataset.id);
        const result = await PhotoPreview.open({ 
            size: 'medium',
            thumbnail: this.slides[index - 1].image
        });
    }
}