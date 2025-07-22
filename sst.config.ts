// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "pack-upload-manager",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc", { bastion: true });
    const rds = new sst.aws.Postgres("MyPostgres", { vpc });
    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "public"
    });

    const DATABASE_URL = $interpolate`postgresql://${rds.username}:${rds.password}@${rds.host}:${rds.port}/${rds.database}`;
    const CLOUD_STORAGE = 'true';
    
    new sst.x.DevCommand("Prisma", {
      environment: { DATABASE_URL },
      dev: {
        autostart: false,
        command: "npx prisma studio",
      },
    });

    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    new sst.aws.Service("MyWeb", {
      cluster,
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      link: [bucket, rds],
      environment: { DATABASE_URL, SST: 'true', CLOUD_STORAGE, BUCKET_NAME: bucket.name },
      dev: {
        command: "npm run dev",
      },
    });
  },
});
