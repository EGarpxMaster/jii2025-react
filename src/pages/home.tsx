import Carousel from "../components/home/carousel/carousel";
import EventInfo from "../components/home/event-info/event-info";
import "../components/home/countdown/countdown";
import Countdown from "../components/home/countdown/countdown";

export default function Home() {
  return (
    <div className="w-full">
      
      <main className="w-full mt-[100px] md:mt-[90px]">
        <Carousel />
        <Countdown />
        <EventInfo />
      </main>
    </div>
  )
}