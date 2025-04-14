import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Frown, Loader } from "lucide-react";

// Users API function to fetch referral data
import { Users } from "yaponuz/data/controllers/users"; // Import Users API

function index() {
  const { ID } = useParams(); // Get the ID from URL parameters
  const [referralData, setReferralData] = useState([]); // Initialize referralData as an empty array
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch referral data using Users API
  const getReferralData = useCallback(async (userId) => {
    try {
      const response = await Users.getEducation(userId); // Fetch data using Users API
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-700">Address:</p>
          <p className="mt-2 text-gray-600">{referralData[0].address}</p> {/* Display address text */}
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
          <Frown className="size-20" />
          <div className="text-center">
            <p className="uppercase font-semibold">Afuski, hech narsa topilmadi</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default index;
