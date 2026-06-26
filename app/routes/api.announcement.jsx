import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

import { connectDB } from "../db.server";
import Announcement from "../models/Announcement.server";

export async function action({ request }) {
  const { session, admin } = await authenticate.admin(request);

  const { text } = await request.json();

  // Save to MongoDB
  await connectDB();

  await Announcement.create({
    shop: session.shop,
    text,
  });

  try {
    // Get the Shop GraphQL ID
    const shopResponse = await admin.graphql(
      `#graphql
      query GetShop {
        shop {
          id
        }
      }`
    );

    const shopData = await shopResponse.json();

    // console.log("Shop Data:", shopData);

    const ownerId = shopData.data.shop.id;

    // Save metafield
    const metafieldResponse = await admin.graphql(
      `#graphql
      mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              ownerId,
              namespace: "my_app",
              key: "announcement",
              type: "single_line_text_field",
              value: text,
            },
          ],
        },
      }
    );

    const result = await metafieldResponse.json();

    console.log(
      "Metafield Response:",
      JSON.stringify(result, null, 2)
    );

    return json({
      success: true,
      metafield: result,
    });
  } catch (error) {
    console.error("GraphQL Error:", error);

    if (error.response) {
      console.error(await error.response.text());
    }

    return json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}