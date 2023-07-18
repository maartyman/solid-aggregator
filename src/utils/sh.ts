import { exec } from 'child_process';

export async function sh(cmd: string): Promise<{ stdout: string, stderr: string }> {
  return new Promise<{stdout: string, stderr: string}>(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
