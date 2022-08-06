const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Analia:tOVrC8OkhrcAwbeB@cluster0.h7otejp.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        // await createListing(client, {
        //     saleDate: '2022-08-05',
        //     items: [{
        //         name: "keyboard",
        //         tags: ["electronics", "school", "office"],
        //         price: 500,
        //         quantity: 40
        //     }],
        //     storeLocation: "Dallas",
        //     customer: {
        //         gender: "F",
        //         age: 40,
        //         email: "someone@email.com",
        //         satisfaction: 3
        //     },
        //     couponUsed: true,
        //     purchaseMethod: "Online"
        // })

        //     await createMultipleListings(client, [{
        //         saleDate: '2022-08-15',
        //         items: [{
        //             name: "laptop",
        //             tags: ["electronics", "school", "office"],
        //             price: 862.74,
        //             quantity: 4
        //         }],
        //         storeLocation: "San Diego",
        //         customer: {
        //             gender: "F",
        //             age: 39,
        //             email: "beecho@email.com",
        //             satisfaction: 3
        //         },
        //         couponUsed: true,
        //         purchaseMethod: "In store"
        //     }, {
        //         saleDate: '2022-08-16',
        //         items: [{
        //             name: "notebook",
        //             tags: ["electronics", "school", "office"],
        //             price: 1500,
        //             quantity: 2
        //         }],
        //         storeLocation: "New York",
        //         customer: {
        //             gender: "M",
        //             age: 51,
        //             email: "ann@mail.com",
        //             satisfaction: 3
        //         },
        //         couponUsed: true,
        //         purchaseMethod: "In store"
        //     }
        // ])

        // await listDatabases(client);

        // await findOneListiningByStoreLocation(client, "San Diego");
        await findListingsAfterSaleDateLocation(client, {
            afterSaleDate: "01-03-2000",
            location: 'San Juan',
            maximumNumberOfResults: 5
        })

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

main().catch(console.error);

async function findListingsAfterSaleDateLocation(client, {
    afterSaleDate = "01-03-2000",
    location = 'San Juan',
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = client.db("sample_supplies").collection("sales").find(
        {
            // saleDate:{$gte:"01-03-2021",$lt:"31-03-2021"},
            saleDate: { $gte: afterSaleDate },
            storeLocation: { $eq: location }
        }).sort({ last_review: -1 })
    .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found listing(s) in ${location}: `);
        results.forEach((result, i) => {
            console.log(`${i+1}. Location: ${result.storeLocation}`)
            console.log("saleDate: ", result.saleDate);
            console.log("Items: ", result.items);
            console.log("Customer: ", result.customer);
        })
    } else {
        console.log(`No listings found for location: ${location}`)
    }
}

async function findOneListiningByStoreLocation(client, storeLocation) {
    const result = await client.db("sample_supplies").collection("sales")
        .findOne({ storeLocation: storeLocation });

    if (result) {
        console.log(`Found a listing in the collection with de Store location '${storeLocation}'`);
        console.log(result);
    } else {
        console.log(`No listings found with the Store Location '${storeLocation}'`)
    }
}

async function createMultipleListings(client, newListings) {
    const result = await client.db("sample_supplies").collection("sales")
        .insertMany(newListings);

    console.log(`${result.insertedCount} new listings created with the following id(s):`);
    console.log(result.insertedIds);
}

async function createListing(client, newListing) {
    const result = await client.db("sample_supplies").collection("sales").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);

}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`)
    })
}