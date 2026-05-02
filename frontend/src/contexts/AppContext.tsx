import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "zh";
type Theme = "light" | "dark";

interface Translation {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const translations: Translation = {
  "Project Overview": { en: "Project Overview", zh: "项目概览" },
  "Energy Matrix": { en: "Energy Matrix", zh: "能源矩阵" },
  "Thermal Stats": { en: "Thermal Stats", zh: "热力数据" },
  "Thermal Control": { en: "Thermal Control", zh: "热力控制" },
  "Alert Center": { en: "Alert Center", zh: "告警中心" },
  "User Management": { en: "User Management", zh: "用户管理" },
  "System Settings": { en: "System Settings", zh: "系统设置" },
  "Resource Library": { en: "Resource Library", zh: "操作库" },
  "Publish Updates": { en: "Publish Updates", zh: "发布更新" },
  "Silicon-Melt Core": { en: "Silicon-Melt Core", zh: "硅熔核心" },
  "Temperature Monitoring": { en: "Temperature Monitoring", zh: "热力监控" },
  "Energy Management": { en: "Energy Management", zh: "能源管理" },
  "Heat Management": { en: "Heat Management", zh: "热力管理" },
  "Updates published to core system successfully": {
    en: "Updates published to core system successfully",
    zh: "更新已成功发布至核心系统",
  },
  "Failed to publish updates": {
    en: "Failed to publish updates",
    zh: "发布更新失败",
  },
  "Q4 System": { en: "Q4 System", zh: "Q4系统" },
  Sys_Nominal: { en: "Sys_Nominal", zh: "系统正常" },
  // Dashboard
  "Daily Heat Recycled": { en: "Daily Heat Recycled", zh: "日回收热量" },
  "System Energy Trends": { en: "System Energy Trends", zh: "系统能源趋势" },
  "Live 24h": { en: "Live 24h", zh: "24小时实时" },
  "Recycled Q": { en: "Recycled Q", zh: "回收热量" },
  "Heat Loss": { en: "Heat Loss", zh: "热损失" },
  "Storage Lv": { en: "Storage Lv", zh: "储能水平" },
  "Wind Curtailment Mgt": { en: "Wind Curtailment Mgt", zh: "弃风消纳率" },
  "Battery Temp Compliance": {
    en: "Battery Temp Compliance",
    zh: "电池温度达标率",
  },
  "Est. Lifespan Extension": {
    en: "Est. Lifespan Extension",
    zh: "预计寿命延长倍增",
  },
  "Carbon Emission Reduction": {
    en: "Carbon Emission Reduction",
    zh: "碳排放减排量",
  },
  "All subsystems active": {
    en: "All subsystems active",
    zh: "所有子系统处于活动状态",
  },
  "All subsystems active (99.8% health)": {
    en: "All subsystems active (99.8% health)",
    zh: "运行健康度 99.8%",
  },
  "Target: ≥90%": { en: "Target: ≥90%", zh: "目标：≥90%" },
  "15-25°C Optimal Zone": {
    en: "15-25°C Optimal Zone",
    zh: "15-25°C 最佳区间",
  },
  "vs. Baseline system": { en: "vs. Baseline system", zh: "对比基准系统" },
  "Energy Matrix Core Flow": {
    en: "Energy Matrix Core Flow",
    zh: "能源核心流转",
  },
  "Heat Transfer Matrix": { en: "Heat Transfer Matrix", zh: "热量转移矩阵" },
  "Battery HVAC System": { en: "Battery HVAC System", zh: "电池空调系统" },
  "Grid Excess (Curtailed)": {
    en: "Grid Excess (Curtailed)",
    zh: "电网多余弃电",
  },
  "Heat Subsystems": { en: "Heat Subsystems", zh: "热力子系统" },
  // Dashboard Components
  "Active Heat Flow Matrix": {
    en: "Active Heat Flow Matrix",
    zh: "活动热流矩阵",
  },
  "Battery Matrices": {
    en: "Battery Matrices",
    zh: "电池矩阵",
  },
  "Synergy Running": {
    en: "Synergy Running",
    zh: "协同运行中",
  },
  "Synergy Standby": {
    en: "Synergy Standby",
    zh: "协同待机",
  },
  "Air Cooling Compression Synergy": {
    en: "Air Cooling Compression Synergy",
    zh: "风冷压缩协同",
  },
  "Emergency Stop": {
    en: "Emergency Stop",
    zh: "紧急停止",
  },
  "Global Search": {
    en: "Global Search",
    zh: "全局搜索",
  },
  "Commit Changes": {
    en: "Commit Changes",
    zh: "提交更改",
  },
  "Compressor Path": { en: "Compressor Path", zh: "压缩机式" },
  "Heat Sheet": { en: "Heat Sheet", zh: "贴附发热片" },
  "Forced Air System": { en: "Forced Air System", zh: "风冷+压缩协同" },
  "Salt Melt Pile (Node)": { en: "Salt Melt Pile (Node)", zh: "盐融堆 (节点)" },
  "Subsystem Status": { en: "Subsystem Status", zh: "子系统状态" },
  "Live Metrics": { en: "Live Metrics", zh: "实时指标" },
  "Compressor Hub": { en: "Compressor Hub", zh: "压缩机中心" },
  "Heat Sheet Array": { en: "Heat Sheet Array", zh: "发热片阵列" },
  "Forced Air Sync": { en: "Forced Air Sync", zh: "风冷压缩同步" },
  COLLECTING: { en: "COLLECTING", zh: "采集中" },
  STANDBY: { en: "STANDBY", zh: "待机" },
  Efficiency: { en: "Efficiency", zh: "效率" },
  "Current PWR": { en: "Current PWR", zh: "当前功率" },
  "Output TMP": { en: "Output TMP", zh: "输出温度" },
  "Detailed System Overview": {
    en: "Detailed System Overview",
    zh: "详细系统概览",
  },
  "Nominal State": { en: "Nominal State", zh: "正常状态" },
  "Warning State": { en: "Warning State", zh: "告警状态" },
  "Critical State": { en: "Critical State", zh: "危急状态" },
  // Temperature Page
  Zone: { en: "Zone", zh: "区域" },
  Status: { en: "Status", zh: "状态" },
  "All Zones": { en: "All Zones", zh: "全部区域" },
  "Zone A": { en: "Zone A", zh: "A 区" },
  "Zone B": { en: "Zone B", zh: "B 区" },
  "Zone C": { en: "Zone C", zh: "C 区" },
  "Zone D": { en: "Zone D", zh: "D 区" },
  "Zone E": { en: "Zone E", zh: "E 区" },
  "All Statuses": { en: "All Statuses", zh: "全部状态" },
  Normal: { en: "Normal", zh: "正常" },
  Warning: { en: "Warning", zh: "告警" },
  warning: { en: "Warning", zh: "告警" },
  Low: { en: "Low", zh: "偏低" },
  High: { en: "High", zh: "偏高" },
  Refresh: { en: "Refresh", zh: "刷新" },
  "Realtime Thermal Monitor": {
    en: "Realtime Thermal Monitor",
    zh: "实时温度监测网络",
  },
  "Cell Details": { en: "Cell Details", zh: "单元详情" },
  "Current Temp": { en: "Current Temp", zh: "当前温度" },
  "High Temp Alert": { en: "High Temp Alert", zh: "高温告警" },
  "Target Temp": { en: "Target Temp", zh: "目标温度" },
  "Enable Heating": { en: "Enable Heating", zh: "开启加热" },
  "Enable Cooling": { en: "Enable Cooling", zh: "开启制冷" },
  "Select a battery cell": {
    en: "Select a battery cell to monitor details.",
    zh: "请选择一个电池单元以查看详情。",
  },
  "Active Battery Cells": { en: "Active Battery Cells", zh: "活跃电池群" },
  "View Details": { en: "View Details", zh: "查看详情" },
  "Cell Info": { en: "Cell Info", zh: "电池信息" },
  Predicted: { en: "Predicted", zh: "预测" },
  "Stop Unit": { en: "Stop Unit", zh: "停用单元" },
  "Restart Unit": { en: "Restart Unit", zh: "重启单元" },
  Offline: { en: "Offline", zh: "下线" },
  offline: { en: "Offline", zh: "下线" },
  "Salt Melt Heap": { en: "Salt Melt Heap", zh: "熔盐堆" },
  normal: { en: "Normal", zh: "正常" },
  "Adjust Target Mode": { en: "Adjust Target Mode", zh: "调整目标模式" },
  "Target adjustment via controls enabled.": {
    en: "Target adjustment via controls enabled.",
    zh: "已启用通过控件调整目标。",
  },
  "Action executed successfully": {
    en: "Action executed successfully",
    zh: "操作成功执行",
  },
  "Failed to execute control action": {
    en: "Failed to execute control action",
    zh: "执行控制操作失败",
  },
  "Matrix data refreshed": {
    en: "Matrix data refreshed",
    zh: "矩阵数据已刷新",
  },
  // Alerts Page
  "Critical (P0)": { en: "Critical (P0)", zh: "危急 (P0)" },
  "Severe (P1)": { en: "Severe (P1)", zh: "严重 (P1)" },
  "Warning (P2)": { en: "Warning (P2)", zh: "警告 (P2)" },
  "Info (P3)": { en: "Info (P3)", zh: "提示 (P3)" },
  Filter: { en: "Filter", zh: "筛选" },
  Severity: { en: "Severity", zh: "严重性" },
  Timestamp: { en: "Timestamp", zh: "时间戳" },
  Source: { en: "Source", zh: "来源" },
  "Event Profile": { en: "Event Profile", zh: "事件名称" },
  Critical: { en: "Critical", zh: "危急" },
  Severe: { en: "Severe", zh: "严重" },
  Info: { en: "Info", zh: "提示" },
  "Suggested Action": { en: "Suggested Action", zh: "建议操作" },
  "Create Ticket": { en: "Create Ticket", zh: "创建工单" },
  "Select an alert to view investigation details and remediation playbooks.": {
    en: "Select an alert to view investigation details and remediation playbooks.",
    zh: "选择告警以查看详细信息和处理手册",
  },
  Unresolved: { en: "Unresolved", zh: "未解决" },
  "In Progress": { en: "In Progress", zh: "处理中" },
  Acknowledged: { en: "Acknowledged", zh: "已确认" },
  "Temp Exceeded 55°C Threshold": {
    en: "Temp Exceeded 55°C Threshold",
    zh: "温度超过 55°C 阈值",
  },
  "Comms Link Interrupted": {
    en: "Comms Link Interrupted",
    zh: "通信链路中断",
  },
  "Critically Low Temp 8.3°C": {
    en: "Critically Low Temp 8.3°C",
    zh: "极低温度 8.3°C",
  },
  "Temp Elevation 26.8°C": {
    en: "Temp Elevation 26.8°C",
    zh: "温度异常升高 26.8°C",
  },
  "Alert Acknowledged": { en: "Alert Acknowledged", zh: "告警已确认" },
  "Failed to acknowledge alert": {
    en: "Failed to acknowledge alert",
    zh: "确认告警失败",
  },
  "All active alerts acknowledged": {
    en: "All active alerts acknowledged",
    zh: "所有活动告警已确认",
  },
  "Failed to acknowledge alerts": {
    en: "Failed to acknowledge alerts",
    zh: "确认告警失败",
  },
  "Ticket created successfully": {
    en: "Ticket created successfully",
    zh: "工单创建成功",
  },
  "Trigger forced air sync system immediately. Divert adjacent compressor loads to reduce ambient heat matrix.":
    {
      en: "Trigger forced air sync system immediately. Divert adjacent compressor loads to reduce ambient heat matrix.",
      zh: "立即触发强制风冷同步系统。转移相邻压缩机负载以降低环境热矩阵。",
    },
  "Maintenance Halt": { en: "Maintenance Halt", zh: "维保停机" },
  "Unit successfully stop/decommissioned": { en: "Unit successfully stop/decommissioned", zh: "单元已成功停机/退役" },
  "Acknowledge Alert": { en: "Acknowledge Alert", zh: "确认告警" },
  "Joint System Health": { en: "Joint System Health", zh: "系统综合健康度" },
  "Joint Control Matrix": { en: "Joint Control Matrix", zh: "联合控制矩阵" },
  "Battery Cluster Isolation": { en: "Battery Cluster Isolation", zh: "电池群解裂隔离" },
  "HVAC Duty Cycle Sync": { en: "HVAC Duty Cycle Sync", zh: "空调系统占空比同步" },
  "Salt Melt Diverter": { en: "Salt Melt Diverter", zh: "熔盐分流切换" },
  "Emergency Heat Vent": { en: "Emergency Heat Vent", zh: "紧急热量排放" },
  Auto: { en: "Auto", zh: "自动" },
  Active: { en: "Active", zh: "激活" },
  Manual: { en: "Manual", zh: "手动" },
  Standby: { en: "Standby", zh: "待机" },
  "AI Optimization": { en: "AI Optimization", zh: "AI 优化" },
  // Users Page
  "Manage platform access, roles, and security policies.": {
    en: "Manage platform access, roles, and security policies.",
    zh: "管理平台访问权限、角色和安全策略。",
  },
  "Add User": { en: "Add User", zh: "添加用户" },
  "Active Personnel": { en: "Active Personnel", zh: "活动人员" },
  User: { en: "User", zh: "用户" },
  Role: { en: "Role", zh: "角色" },
  "Last Active": { en: "Last Active", zh: "最近活动" },
  Actions: { en: "Actions", zh: "操作" },
  Name: { en: "Name", zh: "姓名" },
  Email: { en: "Email", zh: "邮箱" },
  Cancel: { en: "Cancel", zh: "取消" },
  Confirm: { en: "Confirm", zh: "确认" },
  Admin: { en: "Admin", zh: "管理员" },
  Operator: { en: "Operator", zh: "操作员" },
  Viewer: { en: "Viewer", zh: "查看者" },
  Engineer: { en: "Engineer", zh: "工程师" },
  "Action:": { en: "Action:", zh: "操作：" },
  "Applied to user": { en: "Applied to user", zh: "已应用于用户" },
  "User added successfully": {
    en: "User added successfully",
    zh: "用户添加成功",
  },
  // Resource Library Page
  "Knowledge Base": { en: "Knowledge Base", zh: "知识库" },
  "Upload Document": { en: "Upload Document", zh: "上传文档" },
  "Search manual, guides, or troubleshooting docs...": {
    en: "Search manual, guides, or troubleshooting docs...",
    zh: "搜索手册、指南或故障排除文档...",
  },
  "All Categories": { en: "All Categories", zh: "所有类别" },
  Manuals: { en: "Manuals", zh: "手册" },
  Training: { en: "Training", zh: "培训" },
  Procedures: { en: "Procedures", zh: "程规" },
  "Document title...": { en: "Document title...", zh: "文档标题..." },
  "Upload Complete": { en: "Upload Complete", zh: "上传完成" },
  "Failed to upload document": {
    en: "Failed to upload document",
    zh: "上传文档失败",
  },
  "Delete Document": { en: "Delete Document", zh: "删除文档" },
  "Document History": { en: "Document History", zh: "文档历史记录" },
  "Document content loaded": {
    en: "Document content loaded",
    zh: "文档内容已加载",
  },
  "Thermal Matrix Calibration Guide": {
    en: "Thermal Matrix Calibration Guide",
    zh: "热矩阵校准指南",
  },
  "Emergency Cooling Protocol v2.1": {
    en: "Emergency Cooling Protocol v2.1",
    zh: "紧急冷却协议 v2.1",
  },
  "Compressor Maintenance Training": {
    en: "Compressor Maintenance Training",
    zh: "压缩机维护培训",
  },
  "Energy Dispatch Formulas Reference": {
    en: "Energy Dispatch Formulas Reference",
    zh: "能量调度公式参考",
  },
  "Downloading Resource...": {
    en: "Downloading Resource...",
    zh: "下载资源中...",
  },
  "Download Complete": { en: "Download Complete", zh: "下载完成" },
  Download: { en: "Download", zh: "下载" },
  "Downloading...": { en: "Downloading...", zh: "下载中..." },
  "PDF Document": { en: "PDF Document", zh: "PDF 文档" },
  SOP: { en: "SOP", zh: "标准操作程序" },
  Video: { en: "Video", zh: "视频" },
  "This is a simulated document view for standard operating procedures and references.":
    {
      en: "This is a simulated document view for standard operating procedures and references.",
      zh: "这是标准操作程序和参考的模拟文档视图。",
    },
  "The actual content would be loaded from a secure documentation repository or CMS.":
    {
      en: "The actual content would be loaded from a secure documentation repository or CMS.",
      zh: "实际内容将从安全的文档库或CMS加载。",
    },
  "1.0 Scope and Applicability": {
    en: "1.0 Scope and Applicability",
    zh: "1.0 范围和适用性",
  },
  "This procedure applies to all Level 2 and Level 3 operators maintaining the thermal management matrices and core subsystem distribution networks.":
    {
      en: "This procedure applies to all Level 2 and Level 3 operators maintaining the thermal management matrices and core subsystem distribution networks.",
      zh: "此程序适用于维护热管理矩阵和核心子系统分配网络的所有 2 级和 3 级操作员。",
    },
  "Confidential. Property of Silicon-Melt Core Operations.": {
    en: "Confidential. Property of Silicon-Melt Core Operations.",
    zh: "机密。硅熔核心运营的财产。",
  },
  "Distribution limited to authorized personnel.": {
    en: "Distribution limited to authorized personnel.",
    zh: "仅限授权人员分发。",
  },
  // Heat Page
  "Subsystem Configuration": {
    en: "Subsystem Configuration",
    zh: "子系统配置",
  },
  "Opening advanced subsystem calibration tools.": {
    en: "Opening advanced subsystem calibration tools.",
    zh: "正在打开高级子系统校准工具。",
  },
  Adjusting: { en: "Adjusting", zh: "调整" },
  "Calibrating heat transfer coefficients.": {
    en: "Calibrating heat transfer coefficients.",
    zh: "正在校准传热系数。",
  },
  "Total Heat Recycled": { en: "Total Heat Recycled", zh: "总回收热量" },
  "Heat Utilization Rate": { en: "Heat Utilization Rate", zh: "热利用率" },
  "Silicon-Melt Storage": { en: "Silicon-Melt Storage", zh: "硅熔储能" },
  "Subsystem Details": { en: "Subsystem Details", zh: "子系统详情" },
  Configure: { en: "Configure", zh: "配置" },
  "Compressor Array Number Alpha": {
    en: "Compressor Array Alpha",
    zh: "压缩机阵列 Alpha",
  },
  "Active - Heat source from B-Block batteries": {
    en: "Active - Heat source from B-Block batteries",
    zh: "活动 - 来自B块电池的热源",
  },
  "Heat Sheet Contact Pad": {
    en: "Heat Sheet Contact Pad",
    zh: "导热片接触垫",
  },
  "Active - Direct contact recycling": {
    en: "Active - Direct contact recycling",
    zh: "活动 - 直接接触回收",
  },
  "Forced Air Sync System": {
    en: "Forced Air Sync System",
    zh: "强制风冷同步系统",
  },
  // Standby
  "Standby Mode": { en: "Standby Mode", zh: "待机模式" },
  // Subsystem names - remove duplicates
  "Report downloaded successfully": {
    en: "Report downloaded successfully",
    zh: "报告下载成功",
  },
  "Failed to generate report": {
    en: "Failed to generate report",
    zh: "生成报告失败",
  },
  Today: { en: "Today", zh: "今天" },
  "This Week": { en: "This Week", zh: "本周" },
  "This Month": { en: "This Month", zh: "本月" },
  "All Regions": { en: "All Regions", zh: "所有区域" },
  "Region A": { en: "Region A", zh: "A 区域" },
  "Region B": { en: "Region B", zh: "B 区域" },
  "Export Report": { en: "Export Report", zh: "导出报告" },
  "Wind Power generation": { en: "Wind Power generation", zh: "风力发电" },
  "Total Load Consumption": { en: "Total Load Consumption", zh: "总负载消耗" },
  "Excess Power (Curtailed)": {
    en: "Excess Power (Curtailed)",
    zh: "多余电能 (弃电)",
  },
  "Real-time Energy Flow Analysis": {
    en: "Real-time Energy Flow Analysis",
    zh: "实时能量流分析",
  },
  "Input Sources": { en: "Input Sources", zh: "输入源" },
  "Battery Heat Recovery": { en: "Battery Heat Recovery", zh: "电池热回收" },
  "Wind Power Curtailment": { en: "Wind Power Curtailment", zh: "弃风" },
  "Compressor Subsystem Load": {
    en: "Compressor Subsystem Load",
    zh: "压缩机子系统负载",
  },
  "Output / Storage": { en: "Output / Storage", zh: "输出/储能" },
  "Battery HVAC Matrix Load": {
    en: "Battery HVAC Matrix Load",
    zh: "电池空调矩阵负载",
  },
  "Silicon-Melt Storage Transferred": {
    en: "Silicon-Melt Storage Transferred",
    zh: "硅熔储能转移",
  },
  "System Path Loss": { en: "System Path Loss", zh: "系统路径损耗" },
  // Settings Page
  "Configure global operational thresholds and automation policies.": {
    en: "Configure global operational thresholds and automation policies.",
    zh: "配置全局操作阈值和自动化策略。",
  },
  "Applying system settings...": {
    en: "Applying system settings...",
    zh: "正在应用系统设置...",
  },
  "Settings applied successfully": {
    en: "Settings applied successfully",
    zh: "设置应用成功",
  },
  "Failed to apply settings": {
    en: "Failed to apply settings",
    zh: "应用设置失败",
  },
  "Auto-Curtailment Mode": { en: "Auto-Curtailment Mode", zh: "自动限电模式" },
  "Automatically reduce charging power when approaching critical temperatures.":
    {
      en: "Automatically reduce charging power when approaching critical temperatures.",
      zh: "在接近临界温度时自动降低充电功率。",
    },
  "Warning Threshold (°C)": {
    en: "Warning Threshold (°C)",
    zh: "告警阈值 (°C)",
  },
  "Critical Threshold (°C)": {
    en: "Critical Threshold (°C)",
    zh: "危急阈值 (°C)",
  },
  "Environment Mode": { en: "Environment Mode", zh: "环境模式" },
  "Eco Mode (Max Efficiency)": {
    en: "Eco Mode (Max Efficiency)",
    zh: "节能模式 (最大效率)",
  },
  Balanced: { en: "Balanced", zh: "平衡模式" },
  "Performance (Max Output)": {
    en: "Performance (Max Output)",
    zh: "性能模式 (最大输出)",
  },
  "Notify on P2 Warnings": { en: "Notify on P2 Warnings", zh: "P2 警告通知" },
  "Send push notifications for all P2/Warning status anomalies.": {
    en: "Send push notifications for all P2/Warning status anomalies.",
    zh: "在出现 P2/告警状态异常时发送推送通知。",
  },
  // Common
  Workspace: { en: "Workspace", zh: "工作区" },
  System: { en: "System", zh: "系统" },
  Online: { en: "Online", zh: "在线" },
  "Active System Alerts": { en: "Active System Alerts", zh: "活动系统告警" },
  "Acknowledge All": { en: "Acknowledge All", zh: "全部确认" },
  "System Parameters": { en: "System Parameters", zh: "系统参数" },
  "Save Changes": { en: "Save Changes", zh: "保存更改" },
  "Thermal Automation": { en: "Thermal Automation", zh: "热控自动化" },
  "Safety Policies": { en: "Safety Policies", zh: "安全策略" },
  "Operational manuals, guides, and training procedures.": {
    en: "Operational manuals, guides, and training procedures.",
    zh: "操作手册、指南和培训程序。",
  },
};

interface AppContextState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: (key: string) => string;
}

export const AppContext = createContext<AppContextState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const t = (key: string) => {
    return translations[key]?.[locale] || key;
  };

  return (
    <AppContext.Provider value={{ locale, setLocale, theme, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
