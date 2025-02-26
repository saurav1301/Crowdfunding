import React, { useContext, createContext } from "react";
import { 
  useAddress, 
  useContract, 
  useMetamask, 
  useContractWrite 
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Fetch contract with correct chain ID (Sepolia: 11155111)
  const { contract, isLoading, error } = useContract("0xf41178235c7832d6beea2e8d53974952b948e8c2");

  console.log("Contract Instance:", contract);
  console.log("Contract Loading:", isLoading);
  console.log("Contract Error:", error);

  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    if (!contract) {
      console.error("Contract is not available.");
      return;
    }
    try {
      const data = await createCampaign({
        args: [
          address, 
          form.title, 
          form.description, 
          ethers.utils.parseEther(form.target?.toString() || "0"), // Safe conversion
          Math.floor(new Date(form.deadline).getTime() / 1000), // Convert to UNIX timestamp
          form.image,
        ],
      });

      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }

    try {
      const campaigns = await contract.call("getCampaigns");

      return campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: campaign.target ? ethers.utils.formatEther(campaign.target.toString()) : "0", // Safe check
        deadline: campaign.deadline ? campaign.deadline.toNumber() : 0, // Default to 0 if undefined
        amountCollected: campaign.amountCollected ? ethers.utils.formatEther(campaign.amountCollected.toString()) : "0", // Safe check
        image: campaign.image || "", 
        pId: i,
      }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  const donate = async (pId, amount) => {
    if (!contract) {
      console.error("Contract is not available.");
      return;
    }

    try {
      const data = await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount?.toString() || "0"), // Safe conversion
      });
      return data;
    } catch (error) {
      console.error("Error donating:", error);
    }
  };

  const getDonations = async (pId) => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }

    try {
      const donations = await contract.call("getDonators", [pId]);
      return donations[0]?.map((donator, i) => ({
        donator,
        donation: donations[1]?.[i] ? ethers.utils.formatEther(donations[1][i].toString()) : "0", // Safe check
      })) || [];
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export function useStateContext() {
  return useContext(StateContext);
}