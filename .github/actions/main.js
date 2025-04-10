const core = require("@actions/core"); // input and output
const exec = require("@actions/exec"); // uloading to S3

function run() {
  // get inputs

  const bucket = core.getInput("bucket", { required: true });
  const bucketRegion = core.getInput("bucket-region", { required: true });
  const distFolder = core.getInput("dist-folder", { required: true });
  // upload files to s3

  const s3URI = `s3://${bucket}`;
  exec.exec(`aws s3 sync ${distFolder} ${s3URI} -- region ${bucketRegion}`);

  // get url
  const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`;
  // http://dkskillmatch.s3-website.eu-north-1.amazonaws.com/
  core.setOutput("website-url", websiteUrl);
}

run();
