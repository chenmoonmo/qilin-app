// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // fs.writeFileSync(path.join(__dirname, 'test.json'), 'Hello World');
  res.status(200).json({ name: 'John Doe' });
}
