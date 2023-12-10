export const RECOMMENDATIONS_QUERY = `#graphql
  query recommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      media(first: 1) {
        nodes {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
          product {
            title
            handle
          }
        }
      }
    }
  }
`;

export const PRODUCTS_BY_ID_QUERY = `#graphql
  query products($productIds: [ID!]!) {
    nodes(ids: $productIds) {
      ... on Product {
        id
      title
      handle
      media(first: 1) {
        nodes {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
          product {
            title
            handle
          }
        }
      }
      }
    }
  }
`;

export const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      metafields(identifiers:[{key: "reviews", namespace: "hydrogen"},{key: "reviewCount", namespace: "custom"}]) {
        namespace
        key
        value
        references(first: 100){          
            nodes {
            ... on Metaobject{
              handle
              fields{
                value
                key
                type
                reference{
                  ... on MediaImage {
                    mediaContentType
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }        
        }
        type
     
      }
      metafield(key: "reviews", namespace: "hydrogen") {
        namespace
        key
        value
      }
      descriptionHtml
      media(first: 10) {
        nodes {
          ... on MediaImage {
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Model3d {
            id
            mediaContentType
            sources {
              mimeType
              url
            }
          }
        }
      }
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
       
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          image {
            id
            url
            
          }
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
