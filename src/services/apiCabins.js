import supabase, { supabaseUrl } from "./supabase";
//Get Cabin
export const getCabins = async () => {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be loaded");
  }
  return data;
};
//Create and Edit Cabin
export const createAndEditCabin = async (newCabin, id) => {
  // https://zhwpqjjjronwhdoaffta.supabase.co/storage/v1/object/public/cabin-images/cabin-002.jpg

  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //1.Create Cabin
  let query = supabase.from("cabins");
  // CREATE
  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }
  // EDIT
  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }
  //2.Upload image
  if (hasImagePath) return data;
  const { error: imageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image, {
      cacheControl: "3600",
      upsert: false,
    });
  if (imageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log(imageError);
    throw new Error(
      "Cabin image could not be uploaded so cabin was not created"
    );
  }

  return data;
};

//Delete Cabin
export const deleteCabins = async (id) => {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
  return data;
};
