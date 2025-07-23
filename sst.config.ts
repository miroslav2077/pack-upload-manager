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
    // networking
    const vpc = new sst.aws.Vpc("PackVpc", { bastion: true });
    // stacking
    const cluster = new sst.aws.Cluster("PackCluster", { vpc });
    // database
    const rds = new sst.aws.Postgres("PackPostgres", { vpc });
    // storage
    const bucket = new sst.aws.Bucket("PackBucket", {
      access: "public"
    });

    // environment variables
    const DATABASE_URL = $interpolate`postgresql://${rds.username}:${rds.password}@${rds.host}:${rds.port}/${rds.database}`;
    const CLOUD_STORAGE = 'true';
    
    // db tool
    new sst.x.DevCommand("Prisma", {
      environment: { DATABASE_URL },
      dev: {
        autostart: false,
        command: "npx prisma studio",
      },
    });

    // sveltekit runtime
    const webApp = new sst.aws.Service("PackWeb", {
      cluster,
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      link: [bucket, rds],
      environment: {
        DATABASE_URL,
        SST: 'true',
        CLOUD_STORAGE,
        BUCKET_NAME: bucket.name,
        UPLOAD_FOLDER: 'uploads',
        BODY_SIZE_LIMIT: '100M'
      },
      dev: {
        command: "npm run dev",
      },
    });

    return {
      url: webApp.url
    }
  },
});
