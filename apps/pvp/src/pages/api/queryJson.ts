import type { NextApiRequest, NextApiResponse } from 'next';

const queryJson = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  const response = await fetch(url as string);
  const json = await response.json();
  res.status(200).json(json);
};

export default queryJson;
