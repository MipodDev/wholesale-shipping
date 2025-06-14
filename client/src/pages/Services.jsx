import { useEffect, useState } from "react";
import axios from "axios";
import ServicesList from "../components/ServicesList";
const Services = () => {
  const [allServices, setAllServices] = useState([]);

  const loadServices = async () => {
    const res = await axios.get("/web/services");
    setAllServices(res.data);
  };

    useEffect(() => {
    loadServices();
  }, []);
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold no-caret">Services Page</h1>{" "}
      <ServicesList
        services={allServices}
      />
    </div>
  );
};

export default Services;
