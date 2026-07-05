import { useEffect, useState } from "react";
import {
  Wifi,
  Smartphone,
  ReceiptText,
  Tv,
  Router,
  Construction,
  UserCircle,
  MessageSquareWarning,
  Info,
  MoreHorizontal,
  Layers,
  MapPin,
  ChevronRight,
  Plus,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./Categories.css";
import {
  getCategories,
  getSubCategories,
  createCategory,
  createSubCategory,
} from "../../services/categoryService";

const categoryIcons = {
  Internet: Wifi,
  Mobile: Smartphone,
  Billing: ReceiptText,
  Subscription: UserCircle,
  TV: Tv,
  Device: Router,
  Infrastructure: Construction,
  Account: UserCircle,
  Complaint: MessageSquareWarning,
  Information: Info,
  Other: MoreHorizontal,
};

const priorityColors = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#111827",
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [locationRequired, setLocationRequired] = useState(false);
  const [defaultPriority, setDefaultPriority] = useState("MEDIUM");

  const [allSubCategories, setAllSubCategories] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);

    const allSubs = await Promise.all(
      data.map((category) => getSubCategories(category.id))
    );

    setAllSubCategories(allSubs.flat());

    if (data.length > 0 && !selectedCategory) {
      handleCategoryClick(data[0]);
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    const data = await getSubCategories(category.id);
    setSubCategories(data);
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    const created = await createCategory({ name: categoryName });

    setCategoryName("");
    setShowCategoryModal(false);

    const data = await getCategories();
    setCategories(data);
    handleCategoryClick(created);
  };

  const handleCreateSubCategory = async () => {
    if (!selectedCategory || !subCategoryName.trim()) return;

    await createSubCategory(selectedCategory.id, {
      name: subCategoryName,
      locationRequired,
      defaultPriority,
    });

    setSubCategoryName("");
    setLocationRequired(false);
    setDefaultPriority("MEDIUM");
    setShowSubCategoryModal(false);

    const updatedSubCategories = await getSubCategories(selectedCategory.id);
    setSubCategories(updatedSubCategories);

    await loadCategories();
  };

  const totalSubCategories = categories.reduce(
    (sum, item) => sum + item.subCategoryCount,
    0
  );

  const priorityData = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((priority) => ({
    name: priority,
    value: allSubCategories.filter(
      (sub) => (sub.defaultPriority || "MEDIUM") === priority
    ).length,
  }));

  const handleToggleLocation = async (sub) => {
  try {
    const updated = await updateSubCategory(sub.id, {
      name: sub.name,
      locationRequired: !sub.locationRequired,
      defaultPriority: sub.defaultPriority,
    });

    setSubCategories((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    setAllSubCategories((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  } catch (err) {
    console.error(err);
  }
};

  const selectedPriorityItems = selectedPriority
    ? allSubCategories.filter(
        (sub) => (sub.defaultPriority || "MEDIUM") === selectedPriority
      )
    : [];

  const locationRequiredCount = subCategories.filter(
    (item) => item.locationRequired
  ).length;

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage ticket categories and location rules.</p>
        </div>
      </div>

      <div className="category-stats">
        <div className="category-stat-card">
          <div className="stat-icon blue">
            <Layers size={24} />
          </div>
          <div>
            <span>Total Categories</span>
            <strong>{categories.length}</strong>
          </div>
        </div>

        <div
          className="category-stat-card clickable"
          onClick={() => setShowPriorityModal(true)}
        >
          <div className="stat-icon purple">
            <MapPin size={24} />
          </div>
          <div>
            <span>Total Sub Categories</span>
            <strong>{totalSubCategories}</strong>
            <small>Click to view priority distribution</small>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="stat-icon green">
            <MapPin size={24} />
          </div>
          <div>
            <span>Location Required</span>
            <strong>{locationRequiredCount}</strong>
          </div>
        </div>
      </div>

      <div className="categories-layout">
        <div className="categories-card">
          <div className="card-title">
            <div>
              <h2>Ticket Categories</h2>
              <span>{categories.length} items</span>
            </div>

            <button
              className="icon-add-btn"
              onClick={() => setShowCategoryModal(true)}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="category-list">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || MoreHorizontal;

              return (
                <button
                  key={category.id}
                  className={`category-item ${
                    selectedCategory?.id === category.id ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="category-left">
                    <div className="category-icon">
                      <Icon size={20} />
                    </div>

                    <div>
                      <strong>{category.name}</strong>
                      <span>{category.subCategoryCount} sub categories</span>
                    </div>
                  </div>

                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="subcategories-card">
          <div className="card-title">
            <div>
              <h2>
                {selectedCategory
                  ? `${selectedCategory.name} Sub Categories`
                  : "Sub Categories"}
              </h2>
              <span>
                {selectedCategory
                  ? `${subCategories.length} rules under this category`
                  : "Select a category"}
              </span>
            </div>

            <button
              className="icon-add-btn"
              disabled={!selectedCategory}
              onClick={() => setShowSubCategoryModal(true)}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="subcategory-grid">
            {subCategories.map((sub) => {
              const priority = sub.defaultPriority || "MEDIUM";

              return (
                <div className="subcategory-item" key={sub.id}>
                  <div>
                    <strong>{sub.name}</strong>
                    <div className="location-toggle">
  <span>Location</span>

  <button
    className={`location-switch ${
      sub.locationRequired ? "required" : "optional"
    }`}
    onClick={() => handleToggleLocation(sub)}
  >
    {sub.locationRequired ? "Required" : "Optional"}
  </button>
</div>
                  </div>

                  <span className={`priority-badge ${priority.toLowerCase()}`}>
                    {priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showPriorityModal && (
        <div className="category-modal-overlay">
          <div className="priority-modal">
            <div className="priority-modal-header">
              <div>
                <h2>Sub Category Priority Distribution</h2>
                <p>Priority breakdown of all sub categories.</p>
              </div>

              <button
                onClick={() => {
                  setShowPriorityModal(false);
                  setSelectedPriority(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="priority-chart">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                  >
                    {priorityData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={priorityColors[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="priority-summary">
              {priorityData.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={`priority-summary-card ${
                    selectedPriority === item.name ? "selected" : ""
                  }`}
                  onClick={() => setSelectedPriority(item.name)}
                >
                  <span className={`priority-dot ${item.name.toLowerCase()}`}></span>
                  <strong>{item.name}</strong>
                  <p>{item.value} sub categories</p>
                </button>
              ))}
            </div>

            {selectedPriority && (
              <div className="priority-detail-list">
                <h3>{selectedPriority} Sub Categories</h3>

                {selectedPriorityItems.length === 0 ? (
                  <p className="priority-empty">No sub categories found.</p>
                ) : (
                  selectedPriorityItems.map((sub) => (
                    <div className="priority-detail-item" key={sub.id}>
                      <span>{sub.name}</span>
                      <small>
                        Location Required: {sub.locationRequired ? "Yes" : "No"}
                      </small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="category-modal-overlay">
          <div className="category-modal">
            <h2>Create Category</h2>
            <p>Add a new ticket category.</p>

            <label>Category Name</label>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Example: Internet"
            />

            <div className="category-modal-actions">
              <button onClick={() => setShowCategoryModal(false)}>Cancel</button>
              <button className="primary-btn" onClick={handleCreateCategory}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubCategoryModal && (
        <div className="category-modal-overlay">
          <div className="category-modal">
            <h2>Add Sub Category</h2>
            <p>{selectedCategory?.name}</p>

            <label>Sub Category Name</label>
            <input
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              placeholder="Example: Weak Signal"
            />

            <label>Default Priority</label>
            <select
              value={defaultPriority}
              onChange={(e) => setDefaultPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={locationRequired}
                onChange={(e) => setLocationRequired(e.target.checked)}
              />
              Location required
            </label>

            <div className="category-modal-actions">
              <button onClick={() => setShowSubCategoryModal(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleCreateSubCategory}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;