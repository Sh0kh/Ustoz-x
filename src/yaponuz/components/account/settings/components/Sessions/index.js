import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Frown, Loader } from "lucide-react";

// Users API function to fetch referral data
import { Users } from "yaponuz/data/api"; // Import Users API

function Sessions() {
  const { ID } = useParams(); // Get the ID from URL parameters
  const [referralData, setReferralData] = useState([]); // Initialize referralData as an empty array
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch referral data using Users API
  const getReferralData = useCallback(async (userId) => {
    try {
      const response = await Users.getReferealByID(userId); // Fetch data using Users API
      if (response && Array.isArray(response.object)) { // Check if response.object is an array
        setReferralData(response.object); // Set the referral data in state
      } else {
        setReferralData([]); // Set an empty array if response is not in expected format
      }
    } catch (err) {
      console.error("Error fetching referral data:", err);
      setReferralData([]); // Ensure we reset the data in case of an error
    } finally {
      setLoading(false); // Stop loading when done
    }
  }, []);

  // Fetch referral data when the component is mounted or ID changes
  useEffect(() => {
    if (ID) {
      setLoading(true); // Start loading
      getReferralData(ID); // Fetch referral data
    }
  }, [ID, getReferralData]);

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex items-center pb-[50px] gap-y-4 justify-center flex-col">
          <Loader className="animate-spin ml-2 size-10" />
          <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
        </div>
      ) : referralData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-2 border-b">Referral ID</th>
                <th className="px-4 py-2 border-b">User ID</th>
                <th className="px-4 py-2 border-b">Referral Date</th>
                {/* Add more table headers as per your data */}
              </tr>
            </thead>
            <tbody>
              {referralData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 border-b">{row.referralId}</td>
                  <td className="px-4 py-2 border-b">{row.userId}</td>
                  <td className="px-4 py-2 border-b">{row.referralDate}</td>
                  {/* Add more data fields as per your data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                <Frown className="size-20" />
                <div className="text-center">
                  <p className="uppercase font-semibold">Afuski, hech narsa topilmadi</p>
                  <p className="text-sm text-gray-700">
                    balki, filtrlarni tozalab ko`rish kerakdir
                  </p>
                </div>
              </div>
      )}
    </div>
  );
}

export default Sessions;
