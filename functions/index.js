const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.autoDeliverOrders = functions.pubsub
    .schedule("every 1 hours") // check every hour
    .onRun(async () => {
      const db = admin.firestore();
      const now = Date.now();

      const ordersSnapshot = await db.collection("order").get();
      const updates = [];

      ordersSnapshot.forEach((docSnap) => {
        const order = docSnap.data();
        const orderDate = order.date.toDate();

        if (!order.cartItems) {
          return;
        }

        const updatedItems = order.cartItems.map((item) => {
          if (
            !item.delivered &&
          now >= orderDate.getTime() + 7 * 24 * 60 * 60 * 1000
          ) {
            return {
              ...item,
              delivered: true,
              deliveredDate: admin.firestore.Timestamp.now(),
              escrowLocked: false,
              released: true,
            };
          }
          return item;
        });

        const hasChanges = updatedItems.some(
            (item, idx) => item !== order.cartItems[idx],
        );

        if (hasChanges) {
          updates.push(docSnap.ref.update({cartItems: updatedItems}));
        }
      });

      await Promise.all(updates);
      console.log(`Auto-delivered ${updates.length} orders/items.`);
    });
