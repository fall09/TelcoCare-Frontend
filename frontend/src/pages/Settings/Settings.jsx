import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Settings as SettingsIcon,
  SlidersHorizontal,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import "./Settings.css";

import {
  getCategories,
  getSubCategories,
  updateSubCategory,
} from "../../services/categoryService";

function Settings() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [employee, setEmployee] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");

  const [saveMessage, setSaveMessage] = useState("");
  const [isSavingPriority, setIsSavingPriority] = useState(false);

  useEffect(() => {
    loadCategories();

    const emp = localStorage.getItem("employee");
    if (emp) {
      setEmployee(JSON.parse(emp));
    }
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId("");
    setSelectedPriority("MEDIUM");
    setSaveMessage("");

    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    const data = await getSubCategories(categoryId);
    setSubCategories(data);
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
    setSaveMessage("");

    const selectedSub = subCategories.find(
      (item) => item.id === Number(subCategoryId)
    );

    setSelectedPriority(selectedSub?.defaultPriority || "MEDIUM");
  };

  const handleSavePriority = async () => {
    if (!selectedSubCategoryId) return;

    const selectedSub = subCategories.find(
      (item) => item.id === Number(selectedSubCategoryId)
    );

    if (!selectedSub) return;

    try {
      setIsSavingPriority(true);
      setSaveMessage("");

      const updatedSub = await updateSubCategory(selectedSubCategoryId, {
        name: selectedSub.name,
        locationRequired: selectedSub.locationRequired,
        defaultPriority: selectedPriority,
      });

      setSubCategories((prev) =>
        prev.map((item) => (item.id === updatedSub.id ? updatedSub : item))
      );

      setSaveMessage("Priority updated successfully.");
    } catch (error) {
      setSaveMessage("Failed to update priority.");
      console.error(error);
    } finally {
      setIsSavingPriority(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const selectedSubCategory = subCategories.find(
    (item) => item.id === Number(selectedSubCategoryId)
  );

  const employeeName = employee
    ? `${employee.firstName || ""} ${employee.lastName || ""}`.trim()
    : "-";

  const priorityOptions = (
    <>
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
      <option value="CRITICAL">Critical</option>
    </>
  );

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage category priorities and your profile.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon orange">
              <SlidersHorizontal size={22} />
            </div>
            <div>
              <h2>Sub Category Priority</h2>
              <p>Update priority level for a selected sub category.</p>
            </div>
          </div>

          <label className="setting-field">
            <span>Category</span>
            <select
              value={selectedCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="setting-field">
            <span>Sub Category</span>
            <select
              value={selectedSubCategoryId}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              disabled={!selectedCategoryId}
            >
              <option value="">Select sub category</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </label>

          <label className="setting-field">
            <span>Priority</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              disabled={!selectedSubCategoryId}
            >
              {priorityOptions}
            </select>
          </label>

          {selectedSubCategoryId && (
            <div className="selected-sub-info">
              <strong>{selectedSubCategory?.name}</strong>
              <span>Selected priority: {selectedPriority}</span>
            </div>
          )}

          {saveMessage && (
            <div
              className={`save-message ${
                saveMessage.includes("Failed") ? "error" : ""
              }`}
            >
              {saveMessage}
            </div>
          )}

          <button
            className={`save-settings-btn priority-save-btn ${
              isSavingPriority ? "saving" : ""
            }`}
            onClick={handleSavePriority}
            disabled={!selectedSubCategoryId || isSavingPriority}
          >
            {isSavingPriority ? "Saving..." : "Save Priority"}
          </button>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon blue">
              <User size={22} />
            </div>
            <div>
              <h2>Employee Profile</h2>
              <p>Your account information.</p>
            </div>
          </div>

          {employee && (
            <div className="employee-profile">
              <div className="employee-row">
                <User size={17} />
                <div>
                  <label>Name</label>
                  <strong>{employeeName || "-"}</strong>
                </div>
              </div>

              <div className="employee-row">
                <Mail size={17} />
                <div>
                  <label>Email</label>
                  <span>{employee.email || "-"}</span>
                </div>
              </div>

              <div className="employee-row">
                <Calendar size={17} />
                <div>
                  <label>Created At</label>
                  <span>
                    {employee.createdAt
                      ? new Date(employee.createdAt).toLocaleDateString("tr-TR")
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="settings-card logout-settings-card">
          <div className="settings-card-header">
            <div className="settings-icon red">
              <LogOut size={22} />
            </div>
            <div>
              <h2>Logout</h2>
              <p>End your current session securely.</p>
            </div>
          </div>

          <button className="logout-settings-btn" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;