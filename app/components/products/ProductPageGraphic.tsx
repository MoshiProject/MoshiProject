import {Image} from '@shopify/hydrogen';

function ProductPageGraphic() {
  const image1 = (
    <Image
      className="h-fit object-cover"
      src="https://cdn.shopify.com/s/files/1/0552/4121/2109/files/1_4.webp?v=1692411747"
      width={200}
      height={300}
    ></Image>
  );
  const image2 = (
    <Image
      className="h-fit"
      src="https://cdn.shopify.com/s/files/1/0552/4121/2109/files/t-shirt-mockup-of-a-cool-man-posing-in-a-dark-alley-2357-el1.webp?v=1692412598"
      width={200}
      height={300}
    ></Image>
  );
  return (
    <div className="md:hidden h-[85vh] mt-8">
      <div className=" h-[48vh]  relative">
        <div className="h-fit rounded-lg overflow-hidden absolute top-6 right-6">
          {image2}
        </div>
        <div className="h-fit rounded-lg overflow-hidden absolute bottom-6 left-6">
          {image1}
        </div>
      </div>
      <div className="mx-4 mt-4">
        <h3 className="text-5xl font-bold [word-spacing:-12px]">
          Why Miss Out?
        </h3>
        <p className="text-md tracking-wider leading-8 mt-4">
          Discover a realm where your love for anime meets unmatched style –
          welcome to a community unlike any other! Dive into a world where your
          passion not only thrives but also takes on a whole new level of style.
          Don't let this opportunity slip away to become an integral part of a
          dynamic community that celebrates your passion and fuels your
          excitement.
        </p>
      </div>
    </div>
  );
}

export default ProductPageGraphic;
