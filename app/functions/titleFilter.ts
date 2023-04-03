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
];

export const productTypes = ['Sweatshirt', 'Hoodie', 'Tee', 'Figure'];

export default function titleFilter(title: string) {
  title = title
    .replace('T-Shirt', 'Tee')
    .replace('Shirt', 'Tee')
    .replace('3d', '3D')
    .replace('T-shirt', 'Tee')
    .replace('Unisex Heavy Blend™ Crewneck ', '')
    .replace('Heavy Blend™ Crewneck ', '')
    .replace('Heavy Blend™', '')
    .replace('Unisex Softstyle ', '')
    .replace('Pullover ', '')
    .replace('Crewneck ', '');

  const removedAnime = replaceArray(title, animeNames, '');
  const filteredName = productTypes.includes(removedAnime.trim())
    ? title
    : removedAnime.trim();
  return filteredName;
}

function replaceArray(str: string, find: string[], replace: string) {
  for (let i = 0; i < find.length; i++) {
    str = str.replace(find[i] + ' ', replace);
    str = str.replace(find[i], replace);
  }
  return str;
}
