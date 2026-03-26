CREATE TABLE `ai_recommendations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`confidence` real,
	`impact` text DEFAULT 'medium',
	`related_kpis` text,
	`status` text DEFAULT 'pending',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `connectors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`config` text,
	`status` text DEFAULT 'active',
	`last_sync_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `contract_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contract_id` integer NOT NULL,
	`alert_type` text NOT NULL,
	`message` text NOT NULL,
	`channel` text,
	`status` text DEFAULT 'sent',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `contract_validations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contract_id` integer NOT NULL,
	`status` text NOT NULL,
	`violations` text,
	`validated_at` integer
);
--> statement-breakpoint
CREATE TABLE `conversation_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `data_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`source` text NOT NULL,
	`schema` text,
	`row_count` integer DEFAULT 0,
	`last_scan_at` integer,
	`status` text DEFAULT 'active',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `data_contracts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`dataset_name` text NOT NULL,
	`version` text DEFAULT 'v1.0',
	`schema` text NOT NULL,
	`constraints` text,
	`sla` text,
	`owner` text,
	`status` text DEFAULT 'active',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `data_incidents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`dataset_name` text NOT NULL,
	`severity` text NOT NULL,
	`status` text DEFAULT 'open',
	`assigned_to` text,
	`root_cause` text,
	`created_at` integer,
	`resolved_at` integer
);
--> statement-breakpoint
CREATE TABLE `drift_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`drift_event_id` integer NOT NULL,
	`message` text NOT NULL,
	`channel` text,
	`status` text DEFAULT 'sent',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `drift_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`drift_type` text NOT NULL,
	`feature_name` text,
	`p_value` real,
	`drift_magnitude` real,
	`severity` text DEFAULT 'medium',
	`status` text DEFAULT 'open',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `executive_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`severity` text NOT NULL,
	`source` text,
	`status` text DEFAULT 'unread',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `federated_queries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`query_text` text NOT NULL,
	`sources_used` text,
	`execution_plan` text,
	`execution_time` real,
	`rows_returned` integer,
	`cached` integer DEFAULT false,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `fraud_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_id` integer,
	`rule_id` integer,
	`alert_type` text NOT NULL,
	`severity` text NOT NULL,
	`status` text DEFAULT 'open',
	`assigned_to` text,
	`notes` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `fraud_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`condition` text NOT NULL,
	`severity` text DEFAULT 'medium',
	`is_active` integer DEFAULT true,
	`triggered_count` integer DEFAULT 0,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `kpi_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`value` real NOT NULL,
	`previous_value` real,
	`unit` text,
	`trend` text,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `lineage_edges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`target_id` integer NOT NULL,
	`transformation_type` text,
	`column_mapping` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `ml_models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`version` text DEFAULT 'v1.0',
	`type` text NOT NULL,
	`features` text,
	`target_column` text,
	`status` text DEFAULT 'active',
	`deployed_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `model_performance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`accuracy` real,
	`precision` real,
	`recall` real,
	`f1_score` real,
	`auc_roc` real,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `nlq_queries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`natural_language` text NOT NULL,
	`generated_sql` text,
	`result_summary` text,
	`insight` text,
	`chart_type` text,
	`execution_time` real,
	`success` integer DEFAULT true,
	`feedback_rating` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `observability_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`asset_id` integer NOT NULL,
	`metric_type` text NOT NULL,
	`value` real NOT NULL,
	`threshold` real,
	`status` text DEFAULT 'ok',
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `optimization_suggestions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pipeline_id` integer NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`current_performance` text,
	`expected_improvement` text,
	`impact` text DEFAULT 'medium',
	`status` text DEFAULT 'pending',
	`applied_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `pipeline_executions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pipeline_id` integer NOT NULL,
	`status` text NOT NULL,
	`start_time` integer,
	`end_time` integer,
	`rows_in` integer DEFAULT 0,
	`rows_out` integer DEFAULT 0,
	`error_message` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `pipeline_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pipeline_id` integer NOT NULL,
	`execution_time` real,
	`cpu_usage` real,
	`memory_usage` real,
	`rows_processed` integer DEFAULT 0,
	`cost_estimate` real DEFAULT 0,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `pipeline_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pipeline_name` text NOT NULL,
	`status` text NOT NULL,
	`start_time` integer,
	`end_time` integer,
	`rows_processed` integer DEFAULT 0,
	`error_message` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `pipelines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`source_connector_id` integer,
	`target_connector_id` integer,
	`schedule` text,
	`config` text,
	`status` text DEFAULT 'draft',
	`last_run_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `quality_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rule_id` integer NOT NULL,
	`dataset_name` text NOT NULL,
	`score` real NOT NULL,
	`status` text NOT NULL,
	`details` text,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `quality_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`dataset_name` text NOT NULL,
	`rule_type` text NOT NULL,
	`condition` text NOT NULL,
	`threshold` real DEFAULT 0.95,
	`is_active` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `query_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`query_hash` text NOT NULL,
	`result` text NOT NULL,
	`hit_count` integer DEFAULT 0,
	`expires_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `query_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`query_text` text NOT NULL,
	`execution_time` real,
	`cost` real,
	`rows_returned` integer,
	`optimization_applied` text,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `risk_simulations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`parameters` text NOT NULL,
	`results` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`parameters` text NOT NULL,
	`predicted_outcome` text,
	`confidence` real,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `semantic_mappings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`business_term` text NOT NULL,
	`database_table` text NOT NULL,
	`database_column` text NOT NULL,
	`description` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_ref` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'KES',
	`source_account` text,
	`target_account` text,
	`channel` text,
	`location` text,
	`timestamp` integer,
	`risk_score` real DEFAULT 0,
	`is_fraud` integer DEFAULT false,
	`detection_method` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `trust_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dataset_name` text NOT NULL,
	`overall_score` real NOT NULL,
	`completeness_score` real DEFAULT 0,
	`accuracy_score` real DEFAULT 0,
	`consistency_score` real DEFAULT 0,
	`freshness_score` real DEFAULT 0,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `virtual_schemas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`source_connector_id` integer NOT NULL,
	`remote_table` text NOT NULL,
	`column_mappings` text,
	`created_at` integer
);
