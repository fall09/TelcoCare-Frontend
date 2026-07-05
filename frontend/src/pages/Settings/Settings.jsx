import { useEffect, useState } from "react";
import {
  Bell,
  ClipboardCheck,
  Settings as SettingsIcon,
  SlidersHorizontal,
} from "lucide-react";
import "./Settings.css";

import {
  getCategories,
  getSubCategories,
  updateSubCategory,
} from "../../services/categoryService";

function Settings() {
  const [settings, setSettings] = useState({

    defaultPriority: "MEDIUM",
    defaultStatus: "OPEN",
    locationRequiredDefault: true,
    autoAssignTickets: false,

    emailNotifications: true,
    criticalTicketAlerts: true,
    suspendedCustomerAlerts: true,

    trackStatusChanges: true,
    trackCategoryChanges: true,
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");

  const [saveMessage, setSaveMessage] = useState("");
  const [isSavingPriority, setIsSavingPriority] = useState(false);

  useEffect(() => {
    loadCategories();
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

    if (selectedSub) {
      setSelectedPriority(selectedSub.defaultPriority || "MEDIUM");
    } else {
      setSelectedPriority("MEDIUM");
    }
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
    setSaveMessage("");
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

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedSubCategory = subCategories.find(
    (item) => item.id === Number(selectedSubCategoryId)
  );

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
          <p>Manage access rules, ticket defaults and category priorities.</p>
        </div>

        <button className="save-settings-btn">Save Changes</button>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon purple">
              <SettingsIcon size={22} />
            </div>
            <div>
              <h2>Ticket Defaults</h2>
              <p>Set default values for new tickets.</p>
            </div>
          </div>

          <label className="setting-field">
            <span>Default Priority</span>
            <select
              value={settings.defaultPriority}
              onChange={(e) => updateSetting("defaultPriority", e.target.value)}
            >
              {priorityOptions}
            </select>
          </label>

          <label className="setting-field">
            <span>Default Status</span>
            <select
              value={settings.defaultStatus}
              onChange={(e) => updateSetting("defaultStatus", e.target.value)}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </label>

          <div className="setting-row">
            <div>
              <strong>Location Required Default</strong>
              <span>Use location by default when creating ticket rules.</span>
            </div>
            <button
              className={`toggle ${
                settings.locationRequiredDefault ? "on" : ""
              }`}
              onClick={() => toggleSetting("locationRequiredDefault")}
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <strong>Auto Assign Tickets</strong>
              <span>Automatically assign new tickets to available agents.</span>
            </div>
            <button
              className={`toggle ${settings.autoAssignTickets ? "on" : ""}`}
              onClick={() => toggleSetting("autoAssignTickets")}
            >
              <span />
            </button>
          </div>
        </section>

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
              onChange={(e) => handlePriorityChange(e.target.value)}
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
            <div className="settings-icon green">
              <Bell size={22} />
            </div>
            <div>
              <h2>Notifications</h2>
              <p>Configure system alerts.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Email Notifications</strong>
              <span>Send system notifications by email.</span>
            </div>
            <button
              className={`toggle ${settings.emailNotifications ? "on" : ""}`}
              onClick={() => toggleSetting("emailNotifications")}
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <strong>Critical Ticket Alerts</strong>
              <span>Notify supervisors when critical tickets are created.</span>
            </div>
            <button
              className={`toggle ${
                settings.criticalTicketAlerts ? "on" : ""
              }`}
              onClick={() => toggleSetting("criticalTicketAlerts")}
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <strong>Suspended Customer Alerts</strong>
              <span>Notify admins when customers are suspended.</span>
            </div>
            <button
              className={`toggle ${
                settings.suspendedCustomerAlerts ? "on" : ""
              }`}
              onClick={() => toggleSetting("suspendedCustomerAlerts")}
            >
              <span />
            </button>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon dark">
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h2>Audit & Security</h2>
              <p>Track important system changes.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Track Status Changes</strong>
              <span>Keep customer status history and reasons.</span>
            </div>
            <button
              className={`toggle ${settings.trackStatusChanges ? "on" : ""}`}
              onClick={() => toggleSetting("trackStatusChanges")}
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <strong>Track Category Changes</strong>
              <span>Log category and sub category updates.</span>
            </div>
            <button
              className={`toggle ${settings.trackCategoryChanges ? "on" : ""}`}
              onClick={() => toggleSetting("trackCategoryChanges")}
            >
              <span />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;