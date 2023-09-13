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

export type UserDataType = {
  user: {
    id: string;
    name: string;
    sectorName: string;
    acceptedTerms: boolean;
    sectorId: string;
  };
  sector: {
    id: string;
    value: number;
    label: string;
  };
};
