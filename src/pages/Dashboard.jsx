import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../services/auth";
import DashboardHeader from "../components/DashboardHeader";
import BriefCardContainer from "../components/BriefCardContainer";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import CustomHelmet from "../components/CustomHelmet";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [briefs, setBriefs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // page 0 = première page
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const url =
      filter === "ALL"
        ? `/briefs?page=${currentPage}&size=${ITEMS_PER_PAGE}`
        : `/briefs?status=${filter}&page=${currentPage}&size=${ITEMS_PER_PAGE}`;

    api
      .get(url)
      .then((res) => {
        setBriefs(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error(err);
        toast.error(t("dashboard.toast.fetchError"));
      })
      .finally(() => setLoading(false));
  }, [filter, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  const filteredBriefs = briefs.filter((brief) => {
    if (filter === "ALL") return true;
    return brief.status === filter;
  });

  const handleDelete = async (id) => {
    try {
      await api.delete(`/briefs/${id}`);
      setBriefs(prev => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
      toast.error(t("dashboard.toast.error"));
    }
  };

  const updateBrief = (updatedBrief) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === updatedBrief.id ? updatedBrief : b))
    );
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex-grow p-6 max-w-5xl mx-auto w-full">
          <Loader />
        </div>;
      </main>
    );
  }

  return (
    <>
      <CustomHelmet
        titleKey="meta.dashboard.title"
        descriptionKey="meta.dashboard.description"
        path="/dashboard"
      />
      <main className="flex flex-col min-h-screen">
        <div className="flex-grow p-6 max-w-5xl mx-auto w-full">
          <DashboardHeader
            filter={filter}
            onFilterChange={setFilter}
            isFreeLimited={!user?.subscriptionActive && briefs.length >= 1}
            onNewBriefClick={() => { }}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <BriefCardContainer
            briefs={filteredBriefs}
            onDelete={handleDelete}
            onUpdate={updateBrief}
          />
        </div>
      </main>
    </>
  );
}