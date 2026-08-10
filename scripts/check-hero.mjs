const { createClient } = require("next-sanity");
const { createImageUrlBuilder } = require("@sanity/image-url");

const client = createClient({
  projectId: "n5hnlyba",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const q = `*[_type == "siteImages"][0]{
  heroSlide1{ ..., asset->{ _id, url } },
  heroSlide2{ ..., asset->{ _id, url } },
  heroSlide3{ ..., asset->{ _id, url } }
}`;

client
  .fetch(q)
  .then((d) => {
    console.log(JSON.stringify(d, null, 2));
    const img = d?.heroSlide1;
    const builder = createImageUrlBuilder({
      projectId: "n5hnlyba",
      dataset: "production",
    });
    try {
      console.log("urlFor:", builder.image(img).width(800).url());
    } catch (e) {
      console.log("urlFor err:", e.message);
    }
    console.log("direct:", img?.asset?.url);
  })
  .catch((e) => console.error(e));
