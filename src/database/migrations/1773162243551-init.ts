import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773162243551 implements MigrationInterface {
    name = 'Init1773162243551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "position" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "phoneNumber" character varying, "profilePicture" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."attendance_status_enum" AS ENUM('CLOCK_IN', 'CLOCK_OUT')`);
        await queryRunner.query(`CREATE TABLE "attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "status" "public"."attendance_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_466e85b813d871bfb693f443528" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_466e85b813d871bfb693f443528"`);
        await queryRunner.query(`DROP TABLE "attendance"`);
        await queryRunner.query(`DROP TYPE "public"."attendance_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
