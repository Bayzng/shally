import img from "../../assets/shally.jpg";

function HeroSection() {
  return (
    <div>
      <img
        src={img}
        alt=""
        className="w-full object-cover h-[200px] sm:h-[300px] md:h-[450px] lg:h-[550px]"
      />
    </div>
  );
}

export default HeroSection;
