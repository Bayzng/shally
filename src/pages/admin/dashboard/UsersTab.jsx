import { useContext, useEffect, useState } from "react";
import {
  doc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import myContext from "../../../context/data/myContext";
import { fireDB } from "../../../fireabase/FirebaseConfig";
import { MdVerified } from "react-icons/md";
import toast from "react-hot-toast";

function UsersTab({ mode }) {
  const context = useContext(myContext);
  const { user } = context;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsSnap = await getDocs(
          collection(fireDB, "verificationRequests"),
        );
        const requestsData = requestsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsData);
      } catch (err) {
        console.error("Error fetching verification requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (request) => {
    try {
      await updateDoc(doc(fireDB, "users", request.userId), { verified: true });
      await deleteDoc(doc(fireDB, "verificationRequests", request.id));
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      toast.success(`${request.name} is now Verified!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request.");
    }
  };

  const handleDecline = async (request) => {
    try {
      await deleteDoc(doc(fireDB, "verificationRequests", request.id));
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      toast.success(`Request for ${request.name} declined.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to decline request.");
    }
  };

  return (
    <div className="relative overflow-x-auto mb-10">
      <h1
        className="text-center mb-5 text-3xl font-semibold"
        style={{ color: mode === "dark" ? "white" : "" }}
      >
        User Details
      </h1>

      {/* Verification Requests Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Verification Requests</h2>
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No pending verification requests.</p>
        ) : (
          <table className="w-full text-sm text-left mb-6">
            <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={request.id}
                  className={`border-b ${mode === "dark" ? "border-gray-600 text-white" : "border-gray-200"}`}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{request.name}</td>
                  <td className="px-6 py-4">{request.email}</td>
                  <td className="px-6 py-4 text-yellow-700 font-semibold">
                    Pending
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(request)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(request)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Existing Users Table */}
      <table className="w-full text-sm text-left">
        <thead
          className="text-xs uppercase"
          style={{
            backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
            color: mode === "dark" ? "white" : "",
          }}
        >
          <tr>
            <th className="px-6 py-3">S.No</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Verified</th>
            <th className="px-6 py-3">UID</th>
          </tr>
        </thead>
        <tbody>
          {user.map((item, index) => (
            <tr
              key={item.uid || index}
              style={{
                backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "#fafafa",
                color: mode === "dark" ? "white" : "",
              }}
            >
              <td className="px-6 py-4">{index + 1}.</td>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.email}</td>
              <td className="px-6 py-4 flex items-center gap-1">
                <MdVerified
                  size={20}
                  className={item.verified ? "text-green-500" : "text-gray-500"}
                />
                <span
                  className={item.verified ? "text-green-500" : "text-gray-500"}
                >
                  {item.verified ? "Verified" : "Unverified"}
                </span>
              </td>
              <td className="px-6 py-4">{item.uid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTab;
