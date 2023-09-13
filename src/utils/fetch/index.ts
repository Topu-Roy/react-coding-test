import { InputsForAPI, OptionsType } from "@/types";
import toast from "react-hot-toast";

export async function fetchSingleUser(userId: string) {
  try {
    const req = await fetch("api/getSingleUser", {
      method: "POST",
      body: JSON.stringify({ userId: "65017b6238334ca3a8bb65d6" }),
    });

    console.log(req.json());
    if (!req.ok) {
      throw new Error(`HTTP error! Status: ${req.status}`);
    }

    const res = await req.json();
    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchAllSectors() {
  try {
    const response = await fetch("/api/getAllSectors");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// * Sorting the result by alphabetical order
export const sortedObject = (object: OptionsType) =>
  object.sort(
    (
      a: {
        id: string;
        value: number;
        label: string;
      },
      b: {
        id: string;
        value: number;
        label: string;
      }
    ) => {
      const labelA = a.label.toLowerCase();
      const labelB = b.label.toLowerCase();

      if (labelA < labelB) {
        return -1;
      }
      if (labelA > labelB) {
        return 1;
      }
      return 0;
    }
  );

export async function createNewUser(formData: InputsForAPI) {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
    // if (response.ok) {
    // * setting the id into local storage
    //   formData &&
    //     setObj({
    //       name: formData.name,
    //       sectorId: formData.sectorId,
    //       acceptedTerms: formData.acceptedTerms,
    //     });
    //   toast("Added Successfully", {
    //     icon: "👏",
    //     style: {
    //       borderRadius: "10px",
    //       background: "#333",
    //       color: "#fff",
    //     },
    //   });
    //   setIsRedirect(true);
    // }
  } catch (error) {
    toast("Something went wrong", {
      icon: "⛔",
      style: {
        borderRadius: "10px",
        background: "rgb(157 23 77)",
        color: "#fff",
      },
    });
  }
}
