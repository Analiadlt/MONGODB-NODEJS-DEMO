const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Analia:tOVrC8OkhrcAwbeB@cluster0.h7otejp.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        // await deleteListingByLocation(client, "San Juan");
        await deleteListingsBeforeDate(client, new Date("2019-02-15"));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function deleteListingByLocation(client, locationOfListing) {
    const result = await client.db("sample_supplies").collection("sales")
        .deleteOne({ storeLocation: locationOfListing });

    console.log(`${result.deleteCount} document(s) was/were deleted`);
}

async function deleteListingsBeforeDate(client, date) {
    const result = await client.db("sample_supplies").collection("sales")
        .deleteMany({ "saleDate": { $lt: date } });
        
        console.log(`${result.deletedCount} document(s) was/were deleted`);
}