const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Analia:tOVrC8OkhrcAwbeB@cluster0.h7otejp.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        // await updateListingByLocation(client, "Denver", { items: ["mouse", "light"], storeLocation: "New York" });
        // await upsertListingByLocation(client, "San Juan", { storeLocation: "San Juan", items: ["mouse", "light", "monitor"] });
        await updateAllListingsToHavePropertyType(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_supplies").collection("sales")
        .updateMany({ property_type: { $exists: false } },
            { $set: { property_type: "Unknown" } });

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
}

async function updateListingByLocation(client, locationOfListing, updatedListing) {
    const result = await client.db("sample_supplies").collection("sales")
        .updateOne({ storeLocation: locationOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} documents was/were updated`);
}

async function upsertListingByLocation(client, locationOfListing, updatedListing) {
    const result = await client.db("sample_supplies").collection("sales")
        .updateOne({ storeLocation: locationOfListing }, { $set: updatedListing }, { upsert: true });

    console.log(`${result.matchedCount} document(s) matched the query criteria`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} documents was/were updated`);
    }
}