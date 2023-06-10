import React from 'react';

interface Props {
  width: string;
  color: string;
  height: string;
}

export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill={props.color || 'white'}
      stroke={props.color || 'white'}
      {...props}
    >
      <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" />
    </svg>
  );
};
export const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill={props.color || 'white'}
      stroke={props.color || 'white'}
      {...props}
    >
      <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z" />
    </svg>
  );
};
export const PinterestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill={props.color || 'white'}
      stroke={props.color || 'white'}
      {...props}
    >
      <path d="M25,2C12.3178711,2,2,12.3178711,2,25c0,9.8841553,6.2675781,18.3302612,15.036377,21.5769653 c-0.2525635-2.2515869-0.2129517-5.9390259,0.2037964-7.7243652c0.3902588-1.677002,2.5212402-10.6871338,2.5212402-10.6871338 s-0.6433105-1.2883301-0.6433105-3.1911011c0-2.9901733,1.7324219-5.2211914,3.8898315-5.2211914 c1.8349609,0,2.7197876,1.3776245,2.7197876,3.0281982c0,1.8457031-1.1734619,4.6026611-1.78125,7.1578369 c-0.506897,2.1409302,1.0733643,3.8865356,3.1836548,3.8865356c3.821228,0,6.7584839-4.0296021,6.7584839-9.8453369 c0-5.147583-3.697998-8.7471924-8.9795532-8.7471924c-6.1167603,0-9.7072754,4.588562-9.7072754,9.3309937 c0,1.8473511,0.7111816,3.8286743,1.6000977,4.9069824c0.175293,0.2133179,0.2009277,0.3994141,0.1488647,0.6160278 c-0.1629028,0.678894-0.5250854,2.1392822-0.5970459,2.4385986c-0.0934448,0.3944702-0.3117676,0.4763184-0.7186279,0.2869263 c-2.685791-1.2503052-4.364502-5.1756592-4.364502-8.3295898c0-6.7815552,4.9268188-13.0108032,14.206543-13.0108032 c7.4588623,0,13.2547607,5.3138428,13.2547607,12.4179077c0,7.4100342-4.6729126,13.3729858-11.1568604,13.3729858 c-2.178894,0-4.2263794-1.132019-4.9267578-2.4691772c0,0-1.0783081,4.1048584-1.3404541,5.1112061 c-0.4524536,1.7404175-2.3892822,5.3460083-3.3615723,6.9837036C20.1704712,47.6074829,22.5397949,48,25,48 c12.6826172,0,23-10.3173828,23-23C48,12.3178711,37.6826172,2,25,2z" />
    </svg>
  );
};

interface SocialMediaIconsProps {
  className?: string;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({className}) => {
  return (
    <div
      className={`flex w-full justify-center items-center ${className} mb-4 md:justify-start`}
    >
      <a href="https://www.instagram.com/moshiiproject/?hl=en">
        <InstagramIcon
          width={18}
          height={18}
          color="white"
          className="w-6 md:w-8 h-6 md:h-8 md:mx-2 mx-1 text-white"
        />
      </a>
      <a href="https://www.facebook.com/people/MoshiProject/100079962272638/">
        <FacebookIcon
          width={18}
          height={18}
          color="white"
          className="w-6 md:w-8 h-6 md:h-8 md:mx-2 mx-1 text-white"
        />
      </a>

      <PinterestIcon
        width={18}
        height={18}
        color="white"
        className="w-6 md:w-8 h-6 md:h-8 md:mx-2 mx-1 text-white"
      />
    </div>
  );
};

export default SocialMediaIcons;
