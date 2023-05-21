import {Image} from '@shopify/hydrogen';
import {logoURL} from '~/components/HeaderMenu/menuSettings';

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-8 pl-2 ">
      <h1 className="text-3xl font-bold text-center mb-6">About Us</h1>
      <div className="max-w-md md:max-w-2xl md:text-center">
        <p className="text-sm md:text-lg mb-6">
          At MoshiProject, we are passionate about anime and we know that our
          customers are too. That's why we made it our mission to create a
          one-stop-shop for anime enthusiasts. We remember the days of endlessly
          searching for the perfect merchandise and clothing to represent our
          favorite shows and characters. We found ourselves disappointed by the
          limited options and lack of diversity in designs.
        </p>
        <p className="text-sm md:text-lg mb-6">
          So, we decided to take matters into our own hands and create
          MoshiProject. We have something for everyone, from the casual anime
          viewer to the most dedicated fan. Our team works tirelessly to design
          and create clothing made from high-quality materials that feature
          eye-catching designs inspired by your favorite anime shows and
          characters.
        </p>
        <p className="text-sm md:text-lg mb-6">
          At MoshiProject, we take pride in designing and creating our products
          in-house. This allows us to have complete control over the quality and
          attention to detail in every item we offer. We use the best materials
          available to ensure that our clothing is comfortable, durable, and
          built to last. As we continue to grow, we are always striving to
          improve and evolve. We encourage you to check back frequently to see
          what's new and to take advantage of our ever-growing selection of
          products.
        </p>

        <div className="flex justify-center items-center my-12 rounded-full">
          <a href="/">
            <span className="sr-only">MoshiProject</span>
            <Image
              data={{
                url: logoURL,
                altText: 'item.imageAlt',
              }}
              className="object-cover object-center h-24 rounded-3xl"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
