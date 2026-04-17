import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground">Hapus Akun</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Hapus akun dan semua data terkait</p>
            </div>
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4">
                <div className="space-y-0.5 text-red-600">
                    <p className="font-medium">Peringatan</p>
                    <p className="text-sm">Harap berhati-hati, tindakan ini tidak dapat dibatalkan.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" data-test="delete-user-button">
                            Hapus Akun
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Apakah Anda yakin ingin menghapus akun?</DialogTitle>
                        <DialogDescription>
                            Setelah akun dihapus, semua data dan sumber daya terkait akan ikut terhapus secara permanen.
                            Masukkan kata sandi Anda untuk mengonfirmasi penghapusan akun.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{ preserveScroll: true }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="sr-only">Kata Sandi</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Kata sandi"
                                            autoComplete="current-password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() => resetAndClearErrors()}
                                            >
                                                Batal
                                            </Button>
                                        </DialogClose>
                                        <Button variant="destructive" disabled={processing} asChild>
                                            <button type="submit" data-test="confirm-delete-user-button">
                                                Hapus Akun
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
