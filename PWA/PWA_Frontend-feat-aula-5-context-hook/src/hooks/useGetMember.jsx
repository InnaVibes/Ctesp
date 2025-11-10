import { useCallback, useEffect, useState } from "react";

export const useGetMember = (userId) => {
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [member, setMember] = useState({
        data: {}
    });

    const fetchingData = useCallback(() => {
        const querie = `/api/users/member/${userId}`;

        if (userId) {
            setLoading(true);

            fetch(querie, {
                headers: { Accept: "application/json" },
            })
                .then((response) => response.json())
                .then((response) => setMember(response))
                .catch((error) => {
                    setError(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userId]);

    useEffect(() => {
        fetchingData();
    }, [fetchingData]);

    return {
        member,
        isError,
        isLoading,
        load: fetchingData,
    };
};