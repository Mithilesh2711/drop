import React from 'react';
import{Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem} from 'reactstrap';

const items = [
	{
		src: '/assets/images/a.jpg',
		altText: '',
        caption: 'Drop cares for quality of your life.'
	},
	{
        src: '/assets/images/b.jpg',
        altText: '',
        caption: 'We supply pure and mineralized water',
	},
	{
        src: '/assets/images/c.jpg',
		altText: '',
        caption: 'In much cheaper rates than market',
	}
];

class Carousels extends React.Component {
	constructor(props) {
		super(props);
		this.state = { activeIndex: 0 };
		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
		this.goToIndex = this.goToIndex.bind(this);
		this.onExiting = this.onExiting.bind(this);
		this.onExited = this.onExited.bind(this);
	}

	onExiting() {
		this.animating = true;
	}

	onExited() {
		this.animating = false;
	}

	next() {
		if (this.animating) return;
		const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
		this.setState({ activeIndex: nextIndex });
	}

	previous() {
		if (this.animating) return;
		const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
		this.setState({ activeIndex: nextIndex });
	}

	goToIndex(newIndex) {
		if (this.animating) return;
		this.setState({ activeIndex: newIndex });
	}

	render() {
		const { activeIndex } = this.state;

		const slides = items.map((item) => {
			return (
                    <CarouselItem
					onExiting={this.onExiting}
					onExited={this.onExited}
					key={item.src}
				>
					<img class="fit-carousel"  style={{objectFit:"cover"}} src={item.src} alt={item.altText} />
					<CarouselCaption captionText={item.caption} captionHeader={item.caption} />
				</CarouselItem>
                
			);
		});

		return (
			<div class="center">
				<link
					rel='stylesheet'
					href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css'
				/>
				<Carousel
					activeIndex={activeIndex}
					next={this.next}
					previous={this.previous}
				>
					<CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
					{slides}
					<CarouselControl direction='prev' directionText='Previous' onClickHandler={this.previous} />
					<CarouselControl direction='next' directionText='Next' onClickHandler={this.next} />
				</Carousel>
			</div>
		);
	}
}

export default Carousels ;