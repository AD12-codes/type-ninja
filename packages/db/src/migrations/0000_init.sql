CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"username" text,
	"display_username" text,
	"bio" text,
	"keyboard" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "algorithms" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"summary" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"time_best" text NOT NULL,
	"time_average" text NOT NULL,
	"time_worst" text NOT NULL,
	"space" text NOT NULL,
	"explanation" text DEFAULT '' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "language_bests" (
	"user_id" text NOT NULL,
	"language_id" text NOT NULL,
	"result_id" uuid NOT NULL,
	"algorithm_slug" text NOT NULL,
	"wpm" real NOT NULL,
	"raw" real NOT NULL,
	"accuracy" real NOT NULL,
	"consistency" real NOT NULL,
	"achieved_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "language_bests_user_id_language_id_pk" PRIMARY KEY("user_id","language_id")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"extension" text NOT NULL,
	"indent" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_bests" (
	"user_id" text NOT NULL,
	"language_id" text NOT NULL,
	"algorithm_slug" text NOT NULL,
	"result_id" uuid NOT NULL,
	"wpm" real NOT NULL,
	"raw" real NOT NULL,
	"accuracy" real NOT NULL,
	"consistency" real NOT NULL,
	"difficulty" text NOT NULL,
	"achieved_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "personal_bests_user_id_language_id_algorithm_slug_pk" PRIMARY KEY("user_id","language_id","algorithm_slug")
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"snippet_id" integer NOT NULL,
	"algorithm_slug" text NOT NULL,
	"language_id" text NOT NULL,
	"difficulty" text NOT NULL,
	"wpm" real NOT NULL,
	"raw" real NOT NULL,
	"accuracy" real NOT NULL,
	"consistency" real NOT NULL,
	"duration_ms" integer NOT NULL,
	"chars" jsonb NOT NULL,
	"keypresses_correct" integer NOT NULL,
	"keypresses_incorrect" integer NOT NULL,
	"chart" jsonb NOT NULL,
	"stop_on_error" text NOT NULL,
	"auto_indent" boolean NOT NULL,
	"blind_mode" boolean NOT NULL,
	"is_personal_best" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" serial PRIMARY KEY NOT NULL,
	"algorithm_slug" text NOT NULL,
	"language_id" text NOT NULL,
	"code" text NOT NULL,
	"char_count" integer NOT NULL,
	"line_count" integer NOT NULL,
	"content_hash" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_configs" (
	"user_id" text PRIMARY KEY NOT NULL,
	"config" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"user_id" text PRIMARY KEY NOT NULL,
	"tests_completed" integer DEFAULT 0 NOT NULL,
	"tests_started" integer DEFAULT 0 NOT NULL,
	"time_typing_ms" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "language_bests" ADD CONSTRAINT "language_bests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "language_bests" ADD CONSTRAINT "language_bests_result_id_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_bests" ADD CONSTRAINT "personal_bests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_bests" ADD CONSTRAINT "personal_bests_result_id_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_algorithm_slug_algorithms_slug_fk" FOREIGN KEY ("algorithm_slug") REFERENCES "public"."algorithms"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_configs" ADD CONSTRAINT "user_configs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "language_bests_leaderboard_idx" ON "language_bests" USING btree ("language_id","wpm");--> statement-breakpoint
CREATE INDEX "results_user_created_idx" ON "results" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "results_language_created_idx" ON "results" USING btree ("language_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "snippets_algorithm_language_idx" ON "snippets" USING btree ("algorithm_slug","language_id");--> statement-breakpoint
CREATE INDEX "snippets_language_idx" ON "snippets" USING btree ("language_id");