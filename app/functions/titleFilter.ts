/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
export const animeNames = [
  'Neon Genesis Evangelion',
  'Jujutsu Kaisen',
  'Demon Slayer',
  'Attack On Titan',
  'Attack on Titan',
  'Naruto Shippuden',
  'Hunter X Hunter',
  'My Hero Academia',
  'One Piece',
  'Fullmetal Alchemist Brotherhood',
  'Chainsaw Man',
  'Berserk',
  'Mob Psycho',
  'Violet Evergarden',
  'Tokyo Ghoul',
  'Cowboy Bebop',
  'JoJo Bizarre Adventure',
];
// export const animeHandles = { 'Neon Genesis Evangelion': "neon-genesis-evangelion",
// 'Jujutsu Kaisen':"jujutsu-kaisen",
// 'Demon Slayer': "kimetsu-no-yaiba",
// 'Attack On Titan':"attack-on-titan",
// 'Attack on Titan':"attack-on-titan",
// 'Naruto Shippuden':"naruto",
// 'Hunter X Hunter': "hunter-x-hunter",
// 'My Hero Academia':"my-hero-academia",
// 'One Piece',
// 'Fullmetal Alchemist Brotherhood',
// 'Chainsaw Man',
// 'Berserk',
// 'Mob Psycho',
// 'Violet Evergarden',
// 'Tokyo Ghoul',
// 'Cowboy Bebop',
// 'JoJo Bizarre Adventure',}

export const productTypeHandles = {
  Hoodie: 'hoodie',
  Shirt: 't-shirt',
  Sweatshirt: 'sweatshirts',
  Figure: 'figurines',
  Stickers: 'stickers',
  Mug: 'mugs',
  'Mouse Pad': 'mouse-pads',
  '3D Lamp': '3d-lamp',
  'Phone Case': 'phone-cases',
  Case: 'phone-cases',
};

export const productAnimeHandles = {
  'Neon Genesis Evangelion': 'neon-genesis-evangelion',
  'Jujutsu Kaisen': 'jujutsu-kaisen',
  'Demon Slayer': 'kimetsu-no-yaiba',
  'Attack On Titan': 'attack-on-titan',
  'Attack on Titan': 'attack-on-titan',
  'Naruto Shippuden': 'naruto',
  'Hunter X Hunter': 'hunter-x-hunter',
  'My Hero Academia': 'my-hero-academia',
  'One Piece': '',
  'Fullmetal Alchemist Brotherhood': '',
  'Chainsaw Man': 'chainsaw-man',
  Berserk: '',
  'Mob Psycho': '',
  'Violet Evergarden': '',
  'Tokyo Ghoul': '',
  'Cowboy Bebop': '',
  'JoJo Bizarre Adventure': '',
};

export const collectionIdDict = {
  hoodie: 262228574413,
  sweatshirts: 262228410573,
  't-shirt': 262228672717,
};

export const productTypes = [
  'Sweatshirt',
  'Hoodie',
  'Shirt',
  'Figure',
  'Stickers',
  'Mug',
  'Mouse Pad',
  '3D Lamp',
  'Phone Case',
  'Case',
];

export const titleCleanup = (title: string) => {
  return title
    .replace('T-Shirt', 'Shirt')
    .replace('Shirt', 'Shirt')
    .replace('3d', '3D')
    .replace('T-shirt', 'Shirt')
    .replace('Unisex Heavy Blend™ Crewneck ', '')
    .replace('Heavy Blend™ Crewneck ', '')
    .replace('Heavy Blend™', '')
    .replace('Unisex Softstyle ', '')
    .replace('Pullover ', '')
    .replace('Crewneck ', '')
    .replace('Zenitzu', 'Zenitsu')
    .replace(' Phone Case', ' Phone Case')
    .replace('  Case', ' Case')
    .replace('Softstyle', ' ')
    .replace('HUNTER x HUNTER', 'Hunter X Hunter')
    .replace('Boku No Hero Acedemia', 'My Hero Academia')
    .replace('Boku No Hero Academia', 'My Hero Academia')
    .replace('My Hero Acedemia', 'My Hero Academia')
    .replace('Figurine', 'Figure');
};

export default function titleFilter(title: string) {
  title = titleCleanup(title);

  const removedAnime = replaceArray(title, animeNames, '');
  const filteredName = productTypes.includes(removedAnime.trim())
    ? title
    : removedAnime.trim();
  return filteredName;
}

function replaceArray(str: string, find: string[], replace: string) {
  for (let i = 0; i < find.length; i++) {
    str = str.replace(find[i] + '  ', replace);
    str = str.replace(find[i] + ' ', replace);
    str = str.replace(find[i], replace);
  }
  return str;
}
export const charactersMap = {
  Eva: 'Eva',
  'Tanjiro Earrings': 'Tanjiro Kamado',
  Levi: 'Levi Ackerman',
  'Rei Ayanami': 'Rei Ayanami',
  Inosuke: 'Inosuke Hashibira',
  Nezuko: 'Nezuko Kamado',
  'Itachi Uchiha': 'Itachi Uchiha',
  Akatsuki: 'Akatsuki',
  'Rock Lee': 'Rock Lee',
  'Satoru Gojo': 'Satoru Gojo',
  Killua: 'Killua Zoldyck',
  Zenitsu: 'Zenitsu Agatsuma',
  Sukuna: 'Sukuna',
  'Kyojuro Rengoku': 'Kyojuro Rengoku',
  Yeagers: ['Eren Yeager', 'Zeke Yeager'],
  Tanjiro: 'Tanjiro Kamado',
  'Tengen Uzui': 'Tengen Uzui',
  Shikamaru: 'Shikamaru Nara',
  Aizawa: 'Aizawa Shōta',
  Naruto: 'Naruto Uzumaki',
  'Giyu Tomioka': 'Giyu Tomioka',
  'Kakashi Hatake': 'Kakashi Hatake',
  'Roy Mustang': 'Roy Mustang',
  'Hinata Hyuuga': 'Hinata Hyuuga',
  Deku: 'midoriya izuku',
  'Zenitsu  Case': 'Zenitsu Agatsuma',
  'Roronoa Zoro': 'Roronoa Zoro',
  'Tomioka  Case': 'Giyu Tomioka',
  'Tanjiro Kamado': 'Tanjiro Kamado',
  Bakugo: 'Bakugo Katsuki',
  'Kanao Tsuyuri': 'Kanao Tsuyuri',
  'Killua Zoldyck  Killua': 'Killua Zoldyck',
  Hawks: 'Hawks',
  'Midoriya Izuku': 'Midoriya Izuku',
  Shinobu: 'Shinobu Kocho',
  Akaza: 'Akaza',
  'Obanai Iguro': 'Obanai Iguro',
  'Yuji Itadori': 'Yuji Itadori',
  Megumi: 'Megumi Fushiguro',
  'Komi-san': 'Komi-san',
  'Bakugo Skull': 'Bakugo Katsuki',
  'Zeke Yeager': 'Zeke Yeager',
  'Levi Ackerman': 'Levi Ackerman',
  'Gon and Killua': ['Gon Freecss', 'Killua Zoldyck'],
  Tomioka: 'Giyu Tomioka',
  'Itachi and Sasuke': ['Itachi Uchiha', 'Sasuke Uchiha'],
  'Deku My Hero Acedemia': 'Midoriya Izuku',
  'Bakugo Skull My Hero Acedemia': 'Bakugo Katsuki',
  'Aizawa My Hero Acedemia': 'Aizawa Shōta',
  Denji: 'Denji',
  Asuka: 'Asuka',
  Sabito: 'Sabito',
  'Killua and Gon': ['Gon Freecss', 'Killua Zoldyck'],
  Dabi: 'Dabi',
  "Killua's Eyes": 'Killua Zoldyck',
  Mirio: 'Mirio Togata',
  Froppy: 'Froppy',
  Todoroki: 'Shoto Todoroki',
  'Nezuko  Case': 'Nezuko Kamado',
  'Shinobu  Case': 'Shinobu Kocho',
  'L Death Note': 'L',
  'Bakugo My Hero Acedemia': 'Bakugo Katsuki',
  'Inosuke Kimetsu No Yaiba': 'Inosuke Hashibira',
  Gaara: 'Gaara',
  'Roranoa Zoro': 'Roranoa Zoro',
  Power: 'Power',
  Guts: 'Guts',
  Makomo: 'Makomo',
  Rengoku: 'Kyojuro Rengoku',
  Rui: 'Rui',
  'Itadori Yuji': 'Itadori Yuji',
  'Luffy Ace Sabo `': ['Monkey D. Luffy', 'Portgas D. Ace', 'Sabo'],
  'Tanjio Kamado': 'Tanjiro Kamado',
  'Luffy Ace Sabo': ['Monkey D. Luffy', 'Portgas D. Ace', 'Sabo'],
  'Kagome and Inuyasha': ['Kagome Higurashi', 'Inuyasha'],
  "Ken Kanaki's Eyes Tokyo Ghoul": 'Ken Kanaki',
  'Cowboy Bebop Spike': 'Spike Spiegel',
  Spike: 'Spike Spiegel',
  'Old Eren Yeager': 'Eren Yeager',
  'Kamado Nezuko': 'Nezuko Kamado',
  Jiro: 'Jiro',
  'Senku Dr. Stone': 'Senku Ishigami',
  'Hawks My Hero Acedemia': 'My Hero Academia',
  Aki: 'Aki',
  Makima: 'Makima',
  Pochita: 'Pochita',
  'Akatsuki  Naruto': 'Akatsuki',
  'Itachi Uchiha  Naruto': 'Itachi Uchiha',
  'Beast Titan  Attack On Tian': 'Zeke Yeager',
  'Anya  Spy X Family': 'Anya Forger',
  'Nezuko and Tanjiro': ['Nezuko Kamado', 'Tanjiro Kamado'],
  'Naruro Ramen': 'Naruto',
  Inuyasha: 'Inuyasha',
  'Sesshomaru  Inuyasha': 'Sesshomaru Inuyasha',
  'Killua Zoldyck': 'Killua Zoldyck',
  Kurapika: 'Kurapika',
  'Gon Freecss': 'Gon Freecss',
  'Chrollo Lucilfer': 'Chrollo Lucilfer',
  'Shinomiya Kaguya  Kaguya Sama Love Is War': 'Shinomiya Kaguya',
  'Light Yagami  Death Note': 'Light Yagami',
  'L  Death Note': 'L',
  'Inosuke Hashibira': 'Inosuke Hashibira',
  'Zenitsu Agatsuma': 'Zenitsu Agatsuma',
  'Shinobu Kocho': 'Shinobu Kocho',
  'Kamado Tanjirou': 'Tanjiro Kamado',
  'Mitsuri Kanroji': 'Mitsuri Kanroji',
  'Eva 00': 'Eva',
  'Sabito And Tanjiro Mask': ['Sabito', 'Tanjiro Kamado'],
  'Tanjiro Mask': 'Tanjiro Kamado',
  'Sabito Mask': 'Sabito',
  Muichiro: 'Muichiro',
  'Aizawa Boku No Hero Academia': 'Aizawa Shōta',
  'Shinji Ikari': 'Shinji Ikari',
  'Himiko Toga': 'Himiko Toga',
  'Reiner Braun': 'Reiner Braun',
  Escanor: 'Escanor',
  Endeavor: 'Endeavor',
  Eri: 'Eri',
  'Giyuu Tomioka': 'Giyu Tomioka',
};
export const getProductType = (productTitle: string) => {
  const cleanTitle = titleCleanup(productTitle);
  for (const type of productTypes) {
    if (cleanTitle.includes(type)) {
      return type;
    }
  }
};
export const getProductAnime = (productTitle: string) => {
  const cleanTitle = titleCleanup(productTitle);
  for (const anime of animeNames) {
    if (cleanTitle.includes(anime)) {
      return anime;
    }
  }
};
