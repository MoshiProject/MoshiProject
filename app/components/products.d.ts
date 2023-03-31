export type Product = {
  id: string;
  title: string;
  handle: string;
  variants: {
    nodes: {
      image: PartialObjectDeep<Image, {recurseIntoArrays: true}>;
      price: PartialObjectDeep<MoneyV2, {recurseIntoArrays: true}>;
      compareAtPrice: PartialObjectDeep<MoneyV2, {recurseIntoArrays: true}>;
    }[];
  };
  selectedVariant: Variant;
};
export type ProductGridType = {
  collection: {products: {nodes: Product[]}};
  url: string;
};
export type Price = {
  amount: number;
};
export type Collection = {
  handle: string;
  id: string;
  title: string;
  image: PartialObjectDeep<Image, {recurseIntoArrays: true}>;
};
export type Option = {
  value: string;
  name: string;
};
export type Variant = {
  available: boolean;
  barcode: string;
  compare_at_price: number;
  featured_image: ImageType;
  featured_media: any;
  id: number;
  image: ImageType;
  incoming: boolean;
  inventory_management: string;
  inventory_policy: string;
  inventory_quantity: number;
  matched: boolean;
  metafields: any;
  next_incoming_date: string;
  option1: string;
  option2: string;
  option3: string;
  options: string;
  price: number;
  product: Product;
  quantity_rule: any;
  requires_selling_plan: boolean;
  requires_shipping: boolean;
  selected: boolean;
  selling_plan_allocation: any;
  selling_plan_allocations: any;
  sku: string;
  store_availability: any[];
  taxable: boolean;
  title: string;
  unit_price: number;
  unit_price_measurement: any;
  url: string;
  weight: number;
  weight_in_unit: number;
  weight_unit: number;
};
export type ImageType = {
  alt: string;
  aspect_ratio: number;
  attached_to_variant: boolean;
  height: number;
  id: string;
  media_type: string;
  position: number;
  presentation: any;
  preview_image: ImageType;
  product_id: number;
  src: string;
  variants: Variant[];
  width: number;
};
export type LineItemType = {
  merchandise: {product: Product; image: ImageType; title: string};
  quantity: number;
  id: string;
  cost: {totalAmount: PartialObjectDeep<MoneyV2, {recurseIntoArrays: true}>};
};
